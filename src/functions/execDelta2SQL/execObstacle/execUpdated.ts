import { DrKuntaFeature, ObstacleProperties } from '@functions/typing';
import { Client } from 'pg';
import execCreatedObstacle from './execCreated';

export default async function execUpdatedObstacle(
  feature: DrKuntaFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const obstacleProperties: ObstacleProperties = feature.properties as ObstacleProperties;

  const assetTypeID = 220;

  /** Expires asset by setting valid_to as current time returning data if anything was expired.  */
  const expireQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE external_id=($2) AND municipality_code=($3) AND asset_type_id =($4) AND valid_to IS NULL
        RETURNING created_by, created_date
        `,
    values: [dbmodifier, obstacleProperties.ID, municipality_code, assetTypeID]
  };
  const result = await client.query(expireQuery);
  const createdData = result.rows[0];

  if (!createdData) {
    await execCreatedObstacle(feature, municipality_code, dbmodifier, client);
    return;
  }
  const point = `Point(${obstacleProperties.DR_GEOMETRY.x} ${obstacleProperties.DR_GEOMETRY.y} 0 0 )`;

  /** "Updates" asset by creating new asset with same external_id and setting created dates as the same as with the old asset */
  const insertQuery = {
    text: `
        INSERT INTO asset (id, modified_date, geometry, modified_by, asset_type_id, municipality_code, external_id, created_by, created_date) 
        VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', ST_GeomFromText(($1),3067), $2, $3, $4, $5, $6,$7);
        `,
    values: [
      point,
      dbmodifier,
      assetTypeID,
      municipality_code,
      obstacleProperties.ID,
      createdData.created_by,
      createdData.created_date
    ]
  };
  await client.query(insertQuery);

  /** Inserts into lrm_position values: unique id from the corresponding sequence, m value and link id */
  const lrmPositionQuery = {
    text: `
        INSERT INTO lrm_position (id, start_measure, link_id)
        VALUES (nextval('LRM_POSITION_PRIMARY_KEY_SEQ'), $1, $2)
        `,
    values: [obstacleProperties.DR_M_VALUE, obstacleProperties.DR_LINK_ID]
  };
  await client.query(lrmPositionQuery);

  /** Inserts into asset_link the corresponding asset and lrm_position ids */
  const assetLinkQuery = {
    text: `
        INSERT INTO asset_link (asset_id, position_id)
        VALUES (currval('PRIMARY_KEY_SEQ'), currval('LRM_POSITION_PRIMARY_KEY_SEQ'))
        `,
    values: []
  };
  await client.query(assetLinkQuery);
  /**
   * TODO: change for new obstacle types
   */
  const singleChoiceValueQuery = {
    text: `
        WITH _property AS (
          SELECT id
          FROM property 
          WHERE public_id=($1)
        ), _enumerated_value AS (
          SELECT enumerated_value.id
          FROM enumerated_value, _property
          WHERE property_id = _property.id AND value=($2)
        )

        INSERT INTO single_choice_value (asset_id, enumerated_value_id, property_id, modified_date, modified_by)
        VALUES (currval('PRIMARY_KEY_SEQ'), (SELECT id FROM _enumerated_value), (SELECT id FROM _property), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', ($3))
    `,
    values: ['esterakennelma', obstacleProperties.EST_TYYPPI, dbmodifier]
  };
  await client.query(singleChoiceValueQuery);
  return;
}
