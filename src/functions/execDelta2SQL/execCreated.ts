export default async function (feature, client) {
  const assetQuery = {
    text: `
        INSERT INTO asset (id, created_date, external_id, asset_type_id, municipality_code, geometry) 
        VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP, $1, $2, $3, $4);
        `,
    values: [feature.properties.ID, 220, 49, null]
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
        INSERT INTO single_choice_value (asset_id, enumerated_value_id, property_id)
        VALUES (currval('PRIMARY_KEY_SEQ'), (SELECT id from enumerated_value WHERE name_fi='Suljettu yhteys'), (SELECT id FROM property WHERE public_id='esterakennelma'))
    `
  };
  await client.query(singleChoiceValueQuery);
  return;
}
