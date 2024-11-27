import { MatchedFeature, ValidFeature } from '@customTypes/featureTypes';
import {
  additionalPanelQuery,
  checkExistingAssetQuery,
  expireQuery,
  insertAssetLinkQuery,
  insertAssetQuery,
  insertAssetSingleChoiceValuesQuery,
  insertLrmPositionQuery,
  insertNumberQuery,
  insertSingleChoiceQuery,
  insertTextQuery
} from '@libs/pg-tools';
import { assetTypeIdMap } from '@schemas/dbIdMapping';
import { expireResultSchema, insertAssetResultSchema } from '@schemas/dbSchemas';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import { Client, QueryResult } from 'pg';

const execInsert = async (
  feature: MatchedFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
): Promise<void> => {
  const featureProperties = feature.properties;
  if (!featureProperties.DR_GEOMETRY) return;

  const assetTypeID = assetTypeIdMap[featureProperties.TYPE];

  const checkExistingAssetResult = await client.query(
    checkExistingAssetQuery(featureProperties.ID, municipality_code, assetTypeID)
  );

  const expireResult = checkExistingAssetResult.rowCount
    ? await client.query(
        expireQuery(dbmodifier, featureProperties.ID, municipality_code, assetTypeID)
      )
    : undefined;

  const createdData = expireResult
    ? expireResultSchema.validateSync(expireResult.rows[0] as unknown)
    : undefined;

  const point = `Point(${featureProperties.DR_GEOMETRY.x} ${featureProperties.DR_GEOMETRY.y} 0 0 )`;

  const assetResult = insertAssetResultSchema.validateSync(
    (
      await client.query(
        insertAssetQuery(
          point,
          dbmodifier,
          assetTypeID,
          municipality_code,
          featureProperties.ID,
          returnBearing(featureProperties),
          createdData !== undefined,
          createdData ? createdData.created_by : undefined,
          createdData ? createdData.created_date : undefined
        )
      )
    ).rows[0] as unknown
  );
  const assetID = assetResult.id;
  const sideCode =
    featureProperties.TYPE === GeoJsonFeatureType.TrafficSign
      ? featureProperties.TOWARDSDIGITIZING
        ? 2
        : 3
      : undefined;

  const positionId = insertAssetResultSchema.validateSync(
    (
      await client.query(
        insertLrmPositionQuery(
          featureProperties.DR_M_VALUE,
          featureProperties.DR_LINK_ID,
          sideCode
        )
      )
    ).rows[0] as unknown
  ).id;

  await client.query(insertAssetLinkQuery(assetID, positionId));

  const queries: Array<Promise<QueryResult>> = [];

  switch (featureProperties.TYPE) {
    case GeoJsonFeatureType.Obstacle:
      queries.push(
        client.query(
          insertSingleChoiceQuery(
            'esterakennelma',
            featureProperties.EST_TYYPPI,
            assetID,
            dbmodifier
          )
        )
      );
      break;
    case GeoJsonFeatureType.TrafficSign:
      if (featureProperties.ARVO) {
        queries.push(
          client.query(
            insertTextQuery(
              'trafficSigns_value',
              assetID,
              featureProperties.ARVO,
              dbmodifier
            )
          )
        );
      }
      if (featureProperties.TEKSTI) {
        queries.push(
          client.query(
            insertTextQuery(
              'main_sign_text',
              assetID,
              featureProperties.TEKSTI,
              dbmodifier
            )
          )
        );
      }
      if (featureProperties.LISATIETO) {
        queries.push(
          client.query(
            insertTextQuery(
              'trafficSigns_info',
              assetID,
              featureProperties.LISATIETO,
              dbmodifier
            )
          )
        );
      }
      queries.push(
        client.query(
          insertSingleChoiceQuery(
            'old_traffic_code',
            0,
            assetID,
            dbmodifier,
            undefined,
            true
          )
        ),
        client.query(
          insertNumberQuery(
            'terrain_coordinates_x',
            assetID,
            feature.geometry.coordinates[0]
          )
        ),
        client.query(
          insertNumberQuery(
            'terrain_coordinates_y',
            assetID,
            feature.geometry.coordinates[1]
          )
        ),
        client.query(
          insertSingleChoiceQuery(
            'trafficSigns_type',
            featureProperties.LM_TYYPPI,
            assetID,
            dbmodifier,
            1
          )
        )
      );
      if (featureProperties.LISAKILVET.length > 0) {
        queries.push(
          ...featureProperties.LISAKILVET.slice(0, 5).map((panel, i: number) => {
            return client.query(
              additionalPanelQuery(
                panel.LM_TYYPPI,
                assetID,
                i,
                panel.ARVO,
                panel.TEKSTI || undefined,
                panel.KOKO || undefined,
                panel.KALVON_TYYPPI || undefined,
                panel.VARI || undefined
              )
            );
          })
        );
      }
      queries.push(
        client.query(
          insertAssetSingleChoiceValuesQuery(
            [
              featureProperties.RAKENNE ?? 99,
              featureProperties.KUNTO ?? 99,
              featureProperties.KOKO ?? 99,
              featureProperties.KALVON_TYYPPI ?? 99,
              featureProperties.TILA ?? 3,
              99,
              99,
              99,
              99,
              99
            ],
            assetID,
            dbmodifier
          )
        )
      );

      break;
    default:
      console.warn(`ExecSQL: FeatureType not supported.`);
      break;
  }
  await Promise.all(queries);
};

const returnBearing = (featureProperties: ValidFeature['properties']) => {
  if (featureProperties.TYPE === GeoJsonFeatureType.TrafficSign)
    return featureProperties.SUUNTIMA;
  return undefined;
};

export default execInsert;
