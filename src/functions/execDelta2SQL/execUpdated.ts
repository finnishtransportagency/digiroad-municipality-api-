import { ObstacleFeature } from '@functions/typing';
import { Client } from 'pg';
import execCreated from './execCreated';

export default async function (
  feature: ObstacleFeature,
  municipality_code: number,
  client: Client
) {
  const point = `Point(${feature.geometry.coordinates[0]} ${feature.geometry.coordinates[1]} 0 0 )`;
  const assetQuery = {
    text: `
        UPDATE asset
        SET geometry=ST_GeomFromText(($1),3067), modified_date=CURRENT_TIMESTAMP, modified_by=($2)
        WHERE external_id=($3) AND municipality_code=($4)
        RETURNING id
        `,
    values: [point, 'test_modifier', feature.properties.ID, municipality_code]
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

  const singleChoiceValueQuery = {
    text: `
    WITH _property AS (
      SELECT id
      FROM property 
      WHERE public_id=($1) AND asset_type_id=($2)
    ), _enumerated_value AS (
      SELECT enumerated_value.id
      FROM enumerated_value, _property
      WHERE property_id = _property.id AND value=($3)
    )
    UPDATE single_choice_value
    SET enumerated_value_id = (SELECT id FROM _enumerated_value), modified_date=CURRENT_TIMESTAMP, modified_by=($4)
    WHERE asset_id=($5) AND property_id=(SELECT id FROM _property)

`,
    values: [
      'esterakennelma',
      220,
      feature.properties.EST_TYYPPI,
      'test-modifier',
      asset_id
    ]
  };

  await client.query(singleChoiceValueQuery);

  return;
}
