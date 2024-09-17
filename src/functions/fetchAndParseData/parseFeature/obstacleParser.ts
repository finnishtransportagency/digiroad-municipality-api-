import { Feature } from '@customTypes/featureTypes';
import { invalidFeature } from '@libs/schema-tools';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import { infraoObstacleSchema } from '@schemas/muniResponseSchema';

export default (feature: unknown): Feature => {
  const castedFeature = infraoObstacleSchema.cast(feature);
  const properties = castedFeature.properties;
  const id = properties.yksilointitieto;
  const coordinates = castedFeature.geometry.coordinates;

  if (!infraoObstacleSchema.isValidSync(castedFeature))
    return invalidFeature(feature, 'Does not match infraoObstacleSchema');

  return {
    type: 'Feature',
    id: castedFeature.id,
    properties: {
      TYPE: GeoJsonFeatureType.Obstacle,
      ID: String(id),
      EST_TYYPPI: properties.malli === 'Pollari' ? 1 : 2
    },
    geometry: {
      type: 'Point',
      coordinates
    }
  };
};
