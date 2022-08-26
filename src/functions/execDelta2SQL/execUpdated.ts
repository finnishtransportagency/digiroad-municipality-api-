import execCreated from './execCreated';

export default async function (feature, municipality_code, client) {
  const point = `Point(${feature.geometry.coordinates[0]} ${feature.geometry.coordinates[1]} 0 0 )`;
  const assetQuery = {
    text: `
        UPDATE asset
        SET geometry=ST_GeomFromText(($1),3067), modified_date=CURRENT_TIMESTAMP, modified_by=($2)
        WHERE external_id=($3) AND municipality_code=($4)
        RETURNING id
        `,
    values: [point, 'mr_modifier', feature.properties.ID, 49]
  };
  const assetResult = await client.query(assetQuery);
  if (!assetResult.rows[0]) {
    await execCreated(feature, municipality_code, client);
    return;
  }
  const asset_id = assetResult.rows[0].id;

  const assetLinkQuery = {
    text: `
        SELECT position_id
        FROM asset_link
        WHERE asset_id=($1)
        `,
    values: [asset_id]
  };
  const assetLinkResult = await client.query(assetLinkQuery);
  const position_id = assetLinkResult.rows[0].position_id;

  const lrmPositionQuery = {
    text: `
    UPDATE lrm_position
    SET start_measure=($1), link_id=($2), modified_date=CURRENT_TIMESTAMP
    WHERE id=($3)`,
    values: [
      feature.properties.DR_M_VALUE,
      feature.properties.DR_LINK_ID,
      position_id
    ]
  };
  await client.query(lrmPositionQuery);

  return;
}
