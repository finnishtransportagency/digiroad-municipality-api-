import {
  MAX_OFFSET_OBSTACLES,
  MAX_OFFSET_SIGNS,
  offline,
  pgdatabase,
  pghost,
  pgpassword,
  pgport,
  pguser
} from '@functions/config';
import { Client } from 'pg';
import { getParameter } from './ssm-tools';
import { ValidFeature } from '@customTypes/featureTypes';
import { allowedOnKapy } from '@schemas/trafficSignTypes';
import { PostgresQuery, QueryFunction } from '@customTypes/pgTypes';
import {
  AdditionalPanelProperty,
  ChoiceProperty,
  NumberProperty,
  SignProperty,
  TextProperty
} from '@customTypes/propertyTypes';

export const getPostgresClient = async () => {
  return new Client({
    host: pghost,
    port: parseInt(pgport),
    database: pgdatabase,
    user: pguser,
    password: offline ? pgpassword : await getParameter(pgpassword)
  });
};

/**
 * Initializes a connection to the database, executes the query and closes the connection.
 * @param query - The query to be executed
 * @returns The response from the database
 */
export const executeSingleQuery = async (query: PostgresQuery) => {
  const client = await getPostgresClient();
  //console.info('Connecting to database...');
  await client.connect();
  //console.info('Executing query:', query);
  const response = await client.query(query);
  //console.info('Query response:', response);
  await client.end();
  //console.info('Connection closed.');
  return response;
};

export const executeTransaction = async (
  queryFunctions: Array<QueryFunction>,
  propertyFunctions: Array<QueryFunction>,
  errorHandler: (e: Error) => void // TODO: maybe return list of all responses ??
) => {
  const client = await getPostgresClient();
  await client.connect();
  try {
    await client.query('BEGIN');
    await Promise.all(
      queryFunctions.map(async (queryFunction) => await queryFunction(client))
    );
    await Promise.all(
      propertyFunctions.map(async (queryFunction) => await queryFunction(client))
    );
    await client.query('COMMIT');
  } catch (e) {
    console.error('Database rolling back!');
    await client.query('ROLLBACK');
    if (!(e instanceof Error)) throw e;
    errorHandler(e);
  }
  await client.end();
};

/**
 * Selects id from property corresponding to given public_id.
 *
 * @param subqueryName Name of psql CTE. Default: _property
 * @param parameterIndex Index of public_id in values array. Default: 1
 */
export const getPropertySubquery = (
  subqueryName = '_property',
  parameterIndex = 1
) => `${subqueryName} AS (
          SELECT id
          FROM property
          WHERE public_id=($${parameterIndex})
        )`;

/**
 * Fetches roadlinks with admin class not 1 (checks for overwrites in administrative_class table) from municipality in question
 * and selects those that are within 5 meters of the feature.
 *
 * The point is deemed as acceptable if the type is not TRAFFICSIGN, the LM_TYYPPI is in the list of acceptable on kapy or if the road link is not functional class 8.
 *
 * Example shows result row!!!
 *
 * @param municipality the municipality being fetched from
 * @param features the features fetched from the api
 * @example
 * {
 *  id: '392852548',
 *  type: 'TRAFFICSIGN',
 *  roadlinks: [
 *    {
 *      f1: 'LINESTRING ZM (375846.234 6678667.548 39.223 0,375831.028 6678696.81 40.456 32.977,375824.863 6678702.376 40.727 41.283)',
 *      f2: 'ad0e3c7c-dab2-4f60-be21-81d994a5458b:1',
 *      f3: 1,
 *      f4: 'Lähderannantie'
 *    }
 *  ]
 * }
 */
export const getPointQuery = (
  municipalityCode: number,
  features: Array<ValidFeature>
): PostgresQuery => {
  const max_offset = Math.max(MAX_OFFSET_SIGNS, MAX_OFFSET_OBSTACLES);
  const searchRadius = String(max_offset + 3);
  return {
    text: `
      WITH
        acceptable_roadlinks AS (
          SELECT
            linkid,
            shape,
            COALESCE(td.traffic_direction, kr.directiontype) AS directiontype,
            functional_class,
            roadname_fi
          FROM kgv_roadlink kr
          LEFT JOIN traffic_direction td ON td.link_id = kr.linkid
          JOIN functional_class fc ON kr.linkid = fc.link_id
          WHERE
            kr.municipalitycode = ($1)
            AND kr.linkid = fc.link_id
            AND not EXISTS(
              SELECT 1
              FROM administrative_class ac
              WHERE ac.link_id = kr.linkid AND ac.administrative_class = 1
            )
            AND (kr.adminclass != 1 OR kr.adminclass IS NULL)
            AND kr.expired_date is null
        )
      SELECT
        (value#>'{properties}'->>'ID')::TEXT AS ID,
        (value#>'{properties}'->>'TYPE')::TEXT AS TYPE,
        json_agg((st_astext(shape),linkid,directiontype, roadname_fi)) AS roadlinks
      FROM json_array_elements($2) AS features, acceptable_roadlinks
      WHERE
        ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), $4) && acceptable_roadlinks.shape
        AND (                                                   -- This subquery determines which assets can go on pedestrian roads
          (features#>'{properties}'->>'TYPE') != 'TRAFFICSIGN'
          OR (features#>'{properties}'->>'LM_TYYPPI') = ANY(($3)::text[])
          OR acceptable_roadlinks.functional_class != 8
        )
      GROUP BY ID,TYPE
    `,
    values: [
      String(municipalityCode),
      JSON.stringify(features),
      allowedOnKapy,
      searchRadius
    ]
  };
};

/** Selects existing asset checking if the id is same
 * @param externalAssetId The external asset id found in "ID" field.
 * @param assetTypeId Asset type id from mapping of asset types <-- TODO
 */
export const checkExistingAssetQuery = (
  externalAssetId: string,
  municipalityCode: number,
  assetTypeId: number
): PostgresQuery => {
  return {
    text: `
      SELECT id
      FROM asset
      WHERE external_ids=($1) AND municipality_code=($2) AND asset_type_id=($3) AND valid_to IS NULL
    `,
    values: [externalAssetId, String(municipalityCode), String(assetTypeId)]
  };
};

/**
 * Inserts into table "asset" values:
 * Unique id from primary_key_seq sequence, created_date as current time,
 * Returns inserted id for next query.
 *
 * @param pointWKT geometry from wkt,
 * @param dbmodifier "municipality-api-{name of municipality}",
 * @param bearing optional, used for traffic signs only,
 * @param assetTypeId Asset type id from mapping of asset types <-- TODO,
 * @param municipalityCode,
 * @param externalAssetId The external asset id found in "ID" field from parsing.
 * @param isUpdate Boolean to determine if query is used in creation or update. Default: false
 * @param createdBy name of creator of previous version of asset. Default: ''
 * @param createdDate date of creation of previous version of asset. Default: ''
 * @example
 * {
 *  id: TODO check actual type
 * }
 */
export const insertAssetQuery = (
  pointWKT: string,
  dbmodifier: string,
  assetTypeId: number,
  municipalityCode: number,
  externalAssetId: string,
  bearing?: number | undefined,
  isUpdate = false,
  createdBy = '',
  createdDate = ''
): PostgresQuery => {
  const values = [
    dbmodifier,
    pointWKT,
    String(bearing ?? '') || null,
    String(assetTypeId),
    String(municipalityCode),
    externalAssetId
  ];

  const updateValues = isUpdate
    ? values.concat([createdBy, new Date(Date.parse(createdDate)).toISOString()])
    : values;
  const text = `
      INSERT INTO asset (id, ${
        isUpdate ? 'modified_date, modified_by' : 'created_date, created_by'
      }, geometry, bearing, asset_type_id, municipality_code, external_ids${
    isUpdate ? ', created_by, created_date' : ''
  })
      VALUES (nextval('PRIMARY_KEY_SEQ'), CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', $1, ST_GeomFromText(($2),3067), $3, $4, $5, $6${
        isUpdate ? ', $7, $8' : ''
      })
      RETURNING id
    `;
  return {
    text,
    values: updateValues
  };
};

/**
 * Inserts into lrm_position values: unique id from the corresponding sequence, side code, m value and link id.
 *
 * @param mValue m-value of closest point on link, found in field "DR_M_VALUE"
 * @param linkId link id of matched link, found in field "DR_LINK_ID"
 * @param sideCode, optional, used only for traffic signs. (Previous implementation: sideCode = trafficSignProperties.TOWARDSDIGITIZING ? 2 : 3)
 *
 * @returns lrm_position id.
 */
export const insertLrmPositionQuery = (
  mValue: number,
  linkId: string,
  sideCode?: number // obstacles do not have side code
): PostgresQuery => {
  return {
    text: `
      INSERT INTO lrm_position (id, side_code,start_measure, link_id)
      VALUES (nextval('LRM_POSITION_PRIMARY_KEY_SEQ'), $1, $2, $3)
      RETURNING id
    `,
    values: [String(sideCode ?? '') || null, String(mValue), linkId]
  };
};

/**
 * Inserts into asset_link the corresponding asset and lrm_position ids
 * @param assetId asset_id
 * @see insertAssetQuery
 * @param positionId lrm_position id
 * @see insertLrmPositionQuery
 */
export const insertAssetLinkQuery = (
  assetId: number,
  positionId: number
): PostgresQuery => {
  return {
    text: `
      INSERT INTO asset_link (asset_id, position_id)
      VALUES ($1, $2)
    `,
    values: [String(assetId), String(positionId)]
  };
};

export const insertNumberPropertiesBatch = (
  numberProperties: Array<NumberProperty>
): PostgresQuery => {
  const publicIds = numberProperties.map((p) => p.publicId);
  const assetIds = numberProperties.map((p) => String(p.assetId));
  const values = numberProperties.map((p) => String(p.value));

  return {
    text: `
      WITH input_data AS (
        SELECT 
          UNNEST($1::text[]) AS public_id,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::float8[]) AS value
      )
      INSERT INTO number_property_value (
        id, asset_id, property_id, value
      )
      SELECT 
        nextval('PRIMARY_KEY_SEQ'), 
        asset_id, 
        p.id, 
        value
      FROM input_data
      JOIN property p ON p.public_id = input_data.public_id;
    `,
    values: [publicIds, assetIds, values]
  };
};

export const insertTextPropertiesBatch = (
  textProperties: Array<TextProperty>,
  dbmodifier: string
): PostgresQuery => {
  const publicIds = textProperties.map((p) => p.publicId);
  const assetIds = textProperties.map((p) => String(p.assetId));
  const values = textProperties.map((p) => String(p.value));

  return {
    text: `
      WITH input_data AS (
        SELECT 
          UNNEST($1::text[]) AS public_id,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::text[]) AS value
      )
      INSERT INTO text_property_value (
        id, asset_id, property_id, value_fi, created_date, created_by
      )
      SELECT 
        nextval('PRIMARY_KEY_SEQ'), 
        asset_id, 
        p.id, 
        value, 
        CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', 
        '${dbmodifier}'
      FROM input_data
      JOIN property p ON p.public_id = input_data.public_id;
    `,
    values: [publicIds, assetIds, values]
  };
};

export const insertSingleChoicePropertiesBatch = (
  singleChoiceProperties: Array<ChoiceProperty>,
  dbmodifier: string
): PostgresQuery => {
  const publicIds = singleChoiceProperties.map((p) => p.publicId);
  const assetIds = singleChoiceProperties.map((p) => String(p.assetId));
  const enumeratedValues = singleChoiceProperties.map((p) =>
    String(p.enumeratedValue ?? 99)
  );

  return {
    text: `
      WITH input_data AS (
        SELECT 
          UNNEST($1::text[]) AS public_id,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::int[]) AS enumerated_value
      )
      INSERT INTO single_choice_value (
        asset_id, enumerated_value_id, property_id, modified_date, modified_by
      )
      SELECT 
        asset_id,
        ev.id,
        p.id AS property_id,
        CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', 
        '${dbmodifier}'
      FROM input_data
      JOIN property p ON p.public_id = input_data.public_id
      JOIN enumerated_value ev on ev.property_id = p.id AND ev.value = input_data.enumerated_value;
    `,
    values: [publicIds, assetIds, enumeratedValues]
  };
};

export const insertSignTypesBatch = (
  trafficSignTypes: Array<SignProperty>,
  dbmodifier: string
): PostgresQuery => {
  const publicIds = trafficSignTypes.map((p) => p.publicId);
  const assetIds = trafficSignTypes.map((p) => String(p.assetId));
  const enumeratedValues = trafficSignTypes.map((p) => String(p.enumeratedValue ?? 99));

  return {
    text: `
      WITH input_data AS (
        SELECT 
          UNNEST($1::text[]) AS public_id,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::text[]) AS enumerated_value
      ),
      ranked_enumerated_values AS (
        SELECT 
          e.id,
          e.property_id,
          e.name_fi,
          ROW_NUMBER() OVER (PARTITION BY e.name_fi ORDER BY e.id) AS rank
        FROM enumerated_value e)
      INSERT INTO single_choice_value (
        asset_id, enumerated_value_id, property_id, modified_date, modified_by
      )
      SELECT 
        asset_id,
        rev.id,
        p.id,
        CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki',
        '${dbmodifier}'
      FROM input_data
      JOIN property p ON p.public_id = input_data.public_id
      JOIN ranked_enumerated_values rev 
        ON rev.property_id = p.id
        AND rev.name_fi = input_data.enumerated_value
        AND rev.rank = 1;
    `,
    values: [publicIds, assetIds, enumeratedValues]
  };
};

export const insertMultipleChoicePropertiesBatch = (
  multipleChoiceProperties: Array<ChoiceProperty>,
  dbmodifier: string
): PostgresQuery => {
  const publicIds = multipleChoiceProperties.map((p) => p.publicId);
  const assetIds = multipleChoiceProperties.map((p) => String(p.assetId));
  const enumeratedValues = multipleChoiceProperties.map((p) =>
    String(p.enumeratedValue ?? 0)
  );

  return {
    text: `
      WITH input_data AS (
        SELECT 
          UNNEST($1::text[]) AS public_id,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::int[]) AS enumerated_value
      )
      INSERT INTO multiple_choice_value (
        asset_id, enumerated_value_id, property_id, modified_date, modified_by, id
      )
      SELECT 
        asset_id,
        ev.id,
        p.id,
        CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', 
        '${dbmodifier}',
        nextval('PRIMARY_KEY_SEQ')
      FROM input_data
      JOIN property p ON p.public_id = input_data.public_id
      JOIN enumerated_value ev on ev.property_id = p.id AND ev.value = input_data.enumerated_value;
    `,
    values: [publicIds, assetIds, enumeratedValues]
  };
};

export const insertAdditionalPanelsBatch = (
  additionalPanels: Array<AdditionalPanelProperty>
): PostgresQuery => {
  const lmTyyppis = additionalPanels.map((p) => String(p.lmTyyppi));
  const assetIds = additionalPanels.map((p) => String(p.assetId));
  const positions = additionalPanels.map((p) => String(p.position));
  const values = additionalPanels.map((p) => (p.value != null ? String(p.value) : null));
  const texts = additionalPanels.map((p) => (p.text != null ? String(p.text) : null));
  const sizes = additionalPanels.map((p) => (p.size != null ? String(p.size) : null));
  const filmTypes = additionalPanels.map((p) =>
    p.filmType != null ? String(p.filmType) : null
  );
  const colors = additionalPanels.map((p) => (p.color != null ? String(p.color) : null));

  return {
    text: `
      WITH input_data AS (
        SELECT
          UNNEST($1::text[]) AS lmTyyppi,
          UNNEST($2::int[]) AS asset_id,
          UNNEST($3::int[]) AS position,
          UNNEST($4::text[]) AS value,
          UNNEST($5::text[]) AS text,
          UNNEST($6::int[]) AS size,
          UNNEST($7::int[]) AS filmType,
          UNNEST($8::int[]) AS color
      ),
      _property AS (
        SELECT id
          FROM property
          WHERE public_id='trafficSigns_type'
        ),
      ranked_enumerated_values AS (
        SELECT
          e.id,
          e.value,
          e.property_id,
          e.name_fi,
          ROW_NUMBER() OVER (PARTITION BY e.name_fi ORDER BY e.id) AS rank
        FROM enumerated_value e, _property
        WHERE e.property_id = _property.id),
      ap_property AS (
        SELECT id
          FROM property
          WHERE public_id='additional_panel'
        )
      INSERT INTO additional_panel (
        asset_id, id, property_id, additional_sign_type, additional_sign_value, form_position, additional_sign_text, additional_sign_size, additional_sign_coating_type, additional_sign_panel_color
      )
      SELECT
        asset_id,
        nextval('PRIMARY_KEY_SEQ'),
        ap_property.id,
        rev.value,
        value,
        position,
        text,
        size,
        filmType,
        color
      FROM input_data
      JOIN ranked_enumerated_values rev on rev.name_fi = input_data.lmTyyppi
      JOIN (SELECT id FROM ap_property LIMIT 1) ap_property ON TRUE
;
    `,
    values: [lmTyyppis, assetIds, positions, values, texts, sizes, filmTypes, colors]
  };
};

/**
 * Expires asset by setting valid_to as current time returning data if anything was expired.
 *
 * @param dbmodifier "municipality-api-{name of municipality}"
 * @param externalAssetId The external asset id found in "ID" field.
 * @param municipalityCode Finnish official municipality code.
 * @param assetTypeId Asset type id from mapping of asset types <-- TODO
 * @param endAsset Boolean to determine if query is being used for removing asset or updating. Default false returns creation details.
 * @example
 * {
 *  created_by: 'municipality-api-espoo',
 *  created_date: TODO check actual type
 * }
 */
export const expireQuery = (
  dbmodifier: string,
  externalAssetId: string,
  municipalityCode: number,
  assetTypeId: number,
  endAsset = false
): PostgresQuery => {
  const end = endAsset ? '' : 'RETURNING created_by, created_date';
  return {
    text: `
      UPDATE asset
      SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
      WHERE external_ids=($2) AND municipality_code=($3) AND asset_type_id =($4) AND valid_to IS NULL
      ${end}
    `,
    values: [dbmodifier, externalAssetId, String(municipalityCode), String(assetTypeId)]
  };
};
