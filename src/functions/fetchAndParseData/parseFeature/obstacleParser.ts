import { Feature } from '@customTypes/featureTypes';
import { infraoObstacleSchema } from '@schemas/muniResponseSchema';

export default (feature: unknown): Feature => {
  const castedFeature = infraoObstacleSchema.cast(feature);
  const properties = castedFeature.properties;
  const id = properties.yksilointitieto;
  const coordinates = castedFeature.geometry.coordinates;

  if (!infraoObstacleSchema.isValidSync(castedFeature))
    return {
      type: 'Invalid',
      id: id,
      properties: {
        reason: 'Does not match infraoObstacleSchema',
        feature: JSON.stringify(feature)
      }
    };

  return {
    type: 'Feature',
    id: castedFeature.id,
    properties: {
      TYPE: 'OBSTACLE',
      ID: String(id),
      EST_TYYPPI: properties.malli === 'Pollari' ? 1 : 2
    },
    geometry: {
      type: 'Point',
      coordinates: { x: coordinates.x, y: coordinates.y }
    }
  };
};
