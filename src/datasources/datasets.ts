import db from './db'

// These are the datacolumns in datasets table (json_data exluded)
const data_columns = `
dataset_id, 
user_id,
matched_roadlinks, 
matching_rate, 
upload_executed, 
update_finished, 
status_log
`

export const createDataset = async (userId: string, geojson: object) => {
  const result = await db.query(
    `
    INSERT INTO datasets (user_id, json_data, upload_executed)
    VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING dataset_id`,
    [userId, geojson]
  )
  return result.rows[0].dataset_id
}

export const getDatasetsByUserId = async (uuid: string) => {
  const result = await db.query(
    `
    SELECT ${data_columns} 
    FROM datasets
    WHERE user_id = $1`,
    [uuid]
  )
  return result.rows
}

export const getDatasetById = async (id: string, getJSON = false) => {
  const query_columns = getJSON ? data_columns + ', json_data' : data_columns
  const result = await db.query(
    `
    SELECT ${query_columns} 
    FROM datasets 
    WHERE dataset_id = $1`,
    [id]
  )
  return result.rows[0]
}

export const deleteDatasetById = async (id: string) => {
  const result = await db.query(
    'DELETE FROM datasets WHERE dataset_id = $1 RETURNING dataset_id;',
    [id]
  )
  return result.rows[0]
}

export const setUpdateExecuted = async (id: string) => {
  const result = await db.query(
    `UPDATE datasets 
       SET update_finished = CURRENT_TIMESTAMP 
       WHERE dataset_id = $1
       RETURNING dataset_id, update_finished`,
    [id]
  )

  return result.rows
}

export const updateJsonData = async (id: string, geojson: any) => {
  const status = 'Dataset matched but not yet uploaded to Digiroad.'
  const { features } = geojson
  const rateArray = features.filter((f: any) => f.properties.matching_rate >= 0)

  const matching_rate =
    rateArray.reduce((all: 0, current: any) => {
      return (all += current.properties.matching_rate)
    }, 0) / rateArray.length

  const matchedRoadlinks = features.map(
    (Feature: any) => `[${Feature.properties.link_ids.join(',')}]`
  )
  const matchString = `[${matchedRoadlinks.join(',')}]`

  await db.query(
    `UPDATE datasets
      SET
        status_log = $1,
        json_data = $2,
        matching_rate = $3,
        matched_roadlinks = $4::text
      WHERE dataset_id = $5
      RETURNING dataset_id`,
    [status, geojson, matching_rate, matchString, id]
  )
}
