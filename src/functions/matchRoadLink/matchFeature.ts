import { ValidFeature } from '@customTypes/featureTypes';
import { FeatureNearbyLinks } from '@customTypes/roadLinkTypes';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import LineString from 'ol/geom/LineString.js';

const matchFeature = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
) => {
  if (nearbyLinks.length < 1) return 'TODOOOOOOO';
  const featureCoords = feature.geometry.coordinates;
  switch (feature.properties.TYPE) {
    case GeoJsonFeatureType.Obstacle: {
      const closestLink = nearbyLinks.reduce(
        (closest, link) => {
          const shape = new LineString(
            link['points'].reduce(
              (array, point) => [...array, point.x, point.y, point.z, point.m],
              [] as Array<number>
            ),
            'XYZM'
          );
          const closestPoint = shape.getClosestPoint([
            featureCoords[0],
            featureCoords[1],
            featureCoords[2] ?? 0
          ]);
          const distance = new LineString([
            closestPoint,
            [featureCoords[0], featureCoords[1], featureCoords[2] ?? 0]
          ]).getLength();
          return closest.distance < distance ? closest : { link, distance };
        },
        {
          link: undefined,
          distance: Number.MAX_VALUE
        } as { link: FeatureNearbyLinks['roadlinks'][0] | undefined; distance: number }
      );
      // CONTINUE HERE
      break;
    }
    case GeoJsonFeatureType.TrafficSign:
      console.warn('TrafficSigns matchFeature not yet implemented.');
      break;
    /* case GeoJsonFeatureType.Surface:
      console.warn('Surfaces matchFeature not yet implemented.');
      break; */
  }
};

export default matchFeature;
