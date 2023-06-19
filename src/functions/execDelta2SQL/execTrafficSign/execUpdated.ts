import { Feature, TrafficSignProperties } from '@functions/typing';
import { Client } from 'pg';
import execCreated from './execCreated';

export default async function (
  feature: Feature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const trafficSignProperties: TrafficSignProperties =
    feature.properties as TrafficSignProperties;

  const assetTypeID = 300;

  const expireQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE external_id=($2) AND municipality_code=($3) AND asset_type_id =($4) AND valid_to IS NULL
        RETURNING created_by, created_date
        `,
    values: [
      dbmodifier,
      trafficSignProperties.ID,
      municipality_code,
      assetTypeID
    ]
  };
  const expireResult = await client.query(expireQuery);
  const createdData = expireResult.rows[0];

  if (!createdData) {
    await execCreated(feature, municipality_code, dbmodifier, client);
    return;
  }

  const point = `Point(${trafficSignProperties.DR_GEOMETRY.x} ${trafficSignProperties.DR_GEOMETRY.y} 0 0 )`;
  const assetQuery = {
    text: `
        INSERT INTO asset (id, modified_date, geometry, modified_by, bearing, asset_type_id, municipality_code, external_id, created_by, created_date) 
        VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', ST_GeomFromText(($1),3067), $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `,
    values: [
      point,
      dbmodifier,
      trafficSignProperties.SUUNTIMA,
      assetTypeID,
      municipality_code,
      trafficSignProperties.ID,
      createdData.created_by,
      createdData.created_date
    ]
  };
  const assetResult = await client.query(assetQuery);
  const assetID = assetResult.rows[0].id;
  const sideCode = trafficSignProperties.TOWARDSDIGITIZING ? 2 : 3;
  const lrmPositionQuery = {
    text: `
        INSERT INTO lrm_position (id, side_code,start_measure, link_id)
        VALUES (nextval('LRM_POSITION_PRIMARY_KEY_SEQ'), $1, $2, $3)
        `,
    values: [
      sideCode,
      trafficSignProperties.DR_M_VALUE,
      trafficSignProperties.DR_LINK_ID
    ]
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

  const valueQuery = {
    text: `
      WITH _property AS (
        SELECT id
        FROM property 
        WHERE public_id=($1)
      )
      
      INSERT INTO text_property_value (id, asset_id, property_id, value_fi, created_date, created_by)
      VALUES (nextval('PRIMARY_KEY_SEQ'),$2, (SELECT id FROM _property), $3 ,CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $4)
    `,
    values: [
      'trafficSigns_value',
      assetID,
      trafficSignProperties.ARVO,
      dbmodifier
    ]
  };

  await client.query(valueQuery);

  async function numberQuery(publicId: string, value: number) {
    const query = {
      text: `
      WITH _property AS (
        SELECT id
        FROM property 
        WHERE public_id=($1)
        )
        
        INSERT INTO number_property_value (id, asset_id, property_id, value)
        VALUES (nextval('PRIMARY_KEY_SEQ'),$2, (SELECT id FROM _property), $3)
        `,
      values: [publicId, assetID, value]
    };

    await client.query(query);
  }

  await numberQuery('terrain_coordinates_x', feature.geometry.coordinates[0]);

  await numberQuery('terrain_coordinates_y', feature.geometry.coordinates[1]);

  const typeQuery = {
    text: `
    WITH _property AS (
      SELECT id
      FROM property 
      WHERE public_id=($1)
      ), _enumerated_value AS (
        SELECT enumerated_value.id
        FROM enumerated_value, _property
      WHERE property_id = _property.id AND name_fi ~ ($2)
      LIMIT 1
      )
      
    INSERT INTO single_choice_value (asset_id, enumerated_value_id, property_id, modified_date, modified_by)
        VALUES ($3, (SELECT id FROM _enumerated_value), (SELECT id FROM _property), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $4)
    `,
    values: [
      'trafficSigns_type',
      trafficSignProperties.LM_TYYPPI,
      assetID,
      dbmodifier
    ]
  };

  await client.query(typeQuery);

  async function textQuery(publicId: string, value: string) {
    if (!value) return;
    const query = {
      text: `
      WITH _property AS (
        SELECT id
        FROM property 
        WHERE public_id=($1)
      )
      
      INSERT INTO text_property_value (id, asset_id, property_id, value_fi, created_date, created_by)
      VALUES (nextval('PRIMARY_KEY_SEQ'),$2, (SELECT id FROM _property), $3 ,CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $4)
        `,
      values: [publicId, assetID, value, dbmodifier]
    };

    await client.query(query);
  }

  await textQuery('main_sign_text', trafficSignProperties.TEKSTI);

  await textQuery('trafficSigns_info', trafficSignProperties.LISATIETO);

  async function singleChoiseQuery(publicId: string, value: number) {
    const enumeratedValue = value ? value : 99;

    const query = {
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
            VALUES ($3, (SELECT id FROM _enumerated_value), (SELECT id FROM _property), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $4)
            `,
      values: [publicId, enumeratedValue, assetID, dbmodifier]
    };

    await client.query(query);
  }

  await singleChoiseQuery('structure', trafficSignProperties.RAKENNE);

  await singleChoiseQuery('condition', trafficSignProperties.KUNTO);

  await singleChoiseQuery('size', trafficSignProperties.KOKO);

  trafficSignProperties.LISAKILVET.forEach((panel, index) => {
    const panelTypeRegex = `^${panel.LK_TYYPPI} .*$`;
    const additionalPanelQuery = {
      text: `
    WITH ap_property AS (
      SELECT id
      FROM property 
      WHERE public_id=($1)
    ), _property AS (
      SELECT id
      FROM property 
      WHERE public_id=($2)
    ), _enumerated_value AS (
      SELECT enumerated_value.value
      FROM enumerated_value, _property
      WHERE property_id = _property.id AND name_fi ~ ($3)
    )

    INSERT INTO additional_panel (asset_id, id, property_id, additional_sign_type, additional_sign_value, form_position, additional_sign_text, additional_sign_size, additional_sign_coating_type, additional_sign_panel_color)
    VALUES ($4, nextval('PRIMARY_KEY_SEQ'), (SELECT id FROM ap_property), (SELECT value FROM _enumerated_value), $5,$6,$7,$8,$9, $10)
    `,
      values: [
        'additional_panel',
        'trafficSigns_type',
        panelTypeRegex,
        assetID,
        panel.ARVO,
        index + 1,
        panel.TEKSTI,
        panel.KOKO,
        panel.KALVON_TYYPPI,
        panel.VARI
      ]
    };
    client.query(additionalPanelQuery);
  });

  return;
}
