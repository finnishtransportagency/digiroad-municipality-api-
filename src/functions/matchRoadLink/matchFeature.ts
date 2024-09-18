import { Feature, ValidFeature } from '@customTypes/featureTypes';
import { FeatureNearbyLinks } from '@customTypes/roadLinkTypes';
import { MAX_OFFSET } from '@functions/config';
import { invalidFeature } from '@libs/schema-tools';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import LineString from 'ol/geom/LineString.js';

const getClosestLink = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
): Feature => {
  const featureCoords = feature.geometry.coordinates;
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
      const mValue = closestPoint[3];
      const closestX = closestPoint[0];
      const closestY = closestPoint[1];
      const closestZ = closestPoint[2];

      return closest.distance < distance
        ? closest
        : { link, distance, mValue, closestX, closestY, closestZ };
    },
    {
      link: undefined,
      distance: Number.MAX_VALUE,
      mValue: NaN,
      closestX: 0,
      closestY: 0,
      closestZ: 0
    } as {
      link: FeatureNearbyLinks['roadlinks'][0] | undefined;
      distance: number;
      mValue: number;
      closestX: number;
      closestY: number;
      closestZ: number;
    }
  );
  if (closestLink.distance > MAX_OFFSET)
    return invalidFeature(feature, 'No links close enough to asset.');

  return {
    ...feature,
    properties: {
      ...feature.properties,
      DR_LINK_ID: closestLink.link?.linkId,
      DR_M_VALUE: closestLink.mValue,
      DR_OFFSET: closestLink.distance,
      DR_GEOMETRY: {
        x: closestLink.closestX,
        y: closestLink.closestY,
        z: closestLink.closestZ
      }
    }
  } as ValidFeature;
};

const matchFeature = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
): Feature => {
  if (nearbyLinks.length < 1)
    return invalidFeature(feature, 'No links close enough to asset.');
  switch (feature.properties.TYPE) {
    case GeoJsonFeatureType.Obstacle: {
      return getClosestLink(feature, nearbyLinks);
    }
    case GeoJsonFeatureType.TrafficSign:
      return getClosestLink(feature, nearbyLinks);
    default:
      break;
  }
  return invalidFeature(feature, `AssetType not supported by matchFeature.`);
};

export default matchFeature;
