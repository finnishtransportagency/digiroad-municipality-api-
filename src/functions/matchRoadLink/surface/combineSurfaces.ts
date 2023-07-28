import { DrKuntaFeature } from '@functions/typing';
import dissolve from '@turf/dissolve';
import simplify from '@turf/simplify';
import { Feature, Polygon, polygon, featureCollection } from '@turf/helpers';

export default function (features: Array<DrKuntaFeature>) {
  const asPolygons: Array<Feature<Polygon, any>> = [];
  for (const feature of features) {
    feature.geometry.coordinates.forEach((coords) => {
      coords.map((i) => {
        return i.map((j) => {
          return j.slice(0, 2);
        });
      });
      const poly = polygon(coords, feature.properties);
      asPolygons.push(poly);
    });
  }
  const collection = featureCollection(asPolygons);
  const dissolved = dissolve(collection, { propertyName: 'P_TYYPPI' });
  const simple = simplify(dissolved);
  for (let i = 0; i < simple.features.length; i++) {
    simple.features[i].properties.ID = `${i}`;
    simple.features[i].properties.TYPE = 'SURFACE';
  }
  return simple.features;
}
