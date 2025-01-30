import { MatchedFeature, ValidFeature } from '@customTypes/featureTypes';
import {
  AdditionalPanelProperty,
  ChoiceProperty,
  NumberProperty,
  SignProperty,
  TextProperty
} from '@customTypes/propertyTypes';
import {
  checkExistingAssetQuery,
  expireQuery,
  insertAssetLinkQuery,
  insertAssetQuery,
  insertLrmPositionQuery
} from '@libs/pg-tools';
import { assetTypeIdMap } from '@schemas/dbIdMapping';
import { expireResultSchema, insertAssetResultSchema } from '@schemas/dbSchemas';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import { Client } from 'pg';

const execInsert = async (
  feature: MatchedFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client,
  textProperties: Array<TextProperty>,
  numberProperties: Array<NumberProperty>,
  singleChoiceProperties: Array<ChoiceProperty>,
  multipleChoiceProperties: Array<ChoiceProperty>,
  additionalPanels: Array<AdditionalPanelProperty>,
  trafficSignTypes: Array<SignProperty>
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

  switch (featureProperties.TYPE) {
    case GeoJsonFeatureType.Obstacle:
      singleChoiceProperties.push({
        publicId: 'esterakennelma',
        enumeratedValue: featureProperties.EST_TYYPPI,
        assetId: assetID
      });
      break;
    case GeoJsonFeatureType.TrafficSign:
      if (featureProperties.ARVO) {
        textProperties.push({
          publicId: 'trafficSigns_value',
          assetId: assetID,
          value: featureProperties.ARVO
        });
      }
      if (featureProperties.TEKSTI) {
        textProperties.push({
          publicId: 'main_sign_text',
          assetId: assetID,
          value: featureProperties.TEKSTI
        });
      }
      if (featureProperties.LISATIETO) {
        textProperties.push({
          publicId: 'trafficSigns_info',
          assetId: assetID,
          value: featureProperties.LISATIETO
        });
      }
      multipleChoiceProperties.push({
        publicId: 'old_traffic_code',
        enumeratedValue: 0,
        assetId: assetID
      });
      trafficSignTypes.push({
        publicId: 'trafficSigns_type',
        enumeratedValue: featureProperties.LM_TYYPPI,
        assetId: assetID
      });
      numberProperties.push({
        publicId: 'terrain_coordinates_x',
        assetId: assetID,
        value: feature.geometry.coordinates[0]
      });
      numberProperties.push({
        publicId: 'terrain_coordinates_y',
        assetId: assetID,
        value: feature.geometry.coordinates[1]
      });
      if (featureProperties.LISAKILVET.length > 0) {
        featureProperties.LISAKILVET.slice(0, 5).map((panel, i: number) => {
          additionalPanels.push({
            lmTyyppi: panel.LM_TYYPPI,
            assetId: assetID,
            position: i,
            value: panel.ARVO,
            text: panel.TEKSTI || undefined,
            size: panel.KOKO || undefined,
            filmType: panel.KALVON_TYYPPI || undefined,
            color: panel.VARI || undefined
          });
        });
      }
      singleChoiceProperties.push({
        publicId: 'structure',
        enumeratedValue: featureProperties.RAKENNE ?? 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'condition',
        enumeratedValue: featureProperties.KUNTO ?? 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'size',
        enumeratedValue: featureProperties.KOKO ?? 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'coating_type',
        enumeratedValue: featureProperties.KALVON_TYYPPI ?? 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'life_cycle',
        enumeratedValue: featureProperties.TILA ?? 3,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'lane_type',
        enumeratedValue: 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'type_of_damage',
        enumeratedValue: 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'urgency_of_repair',
        enumeratedValue: 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'location_specifier',
        enumeratedValue: 99,
        assetId: assetID
      });
      singleChoiceProperties.push({
        publicId: 'sign_material',
        enumeratedValue: 99,
        assetId: assetID
      });
      break;
    default:
      console.warn(`ExecSQL: FeatureType not supported.`);
      break;
  }
};

const returnBearing = (featureProperties: ValidFeature['properties']) => {
  if (featureProperties.TYPE === GeoJsonFeatureType.TrafficSign)
    return featureProperties.SUUNTIMA;
  return undefined;
};

export default execInsert;
