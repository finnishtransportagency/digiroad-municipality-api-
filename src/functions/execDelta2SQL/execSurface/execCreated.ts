import { Client } from 'pg';
import { DrKuntaFeature, SurfaceProperties } from '@functions/typing';

export default async function execCreatedSurface(
  feature: DrKuntaFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const surfaceProperties: SurfaceProperties =
    feature.properties as SurfaceProperties;
  const assetTypeID = 110;
  for (const roadLink of surfaceProperties.DR_VALIDLINKS) {
    const assetQuery = {
      text: `
    INSERT INTO asset (id, created_date, created_by, asset_type_id, municipality_code)
    VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $1, $2, $3)
    RETURNING id
    `,
      values: [dbmodifier, assetTypeID, municipality_code]
    };
    await client.query(assetQuery);

    const lrmPositionQuery = {
      text: `
    INSERT INTO lrm_position (id,start_measure,end_measure,link_id)
    VALUES (nextval('LRM_POSITION_PRIMARY_KEY_SEQ'),0, $1, $2)
    `,
      values: [roadLink.length, roadLink.linkid]
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
        VALUES (currval('PRIMARY_KEY_SEQ'), (SELECT id FROM _enumerated_value), (SELECT id FROM _property), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', ($3))
    `,
      values: ['paallysteluokka', surfaceProperties.P_TYYPPI, dbmodifier]
    };
    await client.query(singleChoiceValueQuery);
  }
}
