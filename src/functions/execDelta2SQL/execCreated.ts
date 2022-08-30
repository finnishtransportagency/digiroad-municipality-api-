export default async function (feature, municipality_code, client) {
  const point = `Point(${feature.geometry.coordinates[0]} ${feature.geometry.coordinates[1]} 0 0 )`;
  const assetQuery = {
    text: `
        INSERT INTO asset (id, created_date, geometry, created_by,external_id, asset_type_id, municipality_code) 
        VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP, ST_GeomFromText(($1),3067), $2, $3, $4, $5);
        `,
    values: [
      point,
      'test-creator',
      feature.properties.ID,
      220,
      municipality_code
    ]
  };
  await client.query(assetQuery);

  const lrmPositionQuery = {
    text: `
        INSERT INTO lrm_position (id, start_measure, link_id)
        VALUES (nextval('LRM_POSITION_PRIMARY_KEY_SEQ'), $1, $2)
        `,
    values: [feature.properties.DR_M_VALUE, feature.properties.DR_LINK_ID]
  };
  await client.query(lrmPositionQuery);

  const assetLinkQuery = {
    text: `
        INSERT INTO asset_link (asset_id, position_id)
        VALUES (currval('PRIMARY_KEY_SEQ'), currval('LRM_POSITION_PRIMARY_KEY_SEQ'))
        `,
    values: []
  };
  await client.query(assetLinkQuery);
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
        VALUES (currval('PRIMARY_KEY_SEQ'), (SELECT id FROM _enumerated_value), (SELECT id FROM _property), CURRENT_TIMESTAMP,($3))
    `,
    values: ['esterakennelma', feature.properties.EST_TYYPPI, 'test-creator']
  };
  await client.query(singleChoiceValueQuery);
  return;
}
