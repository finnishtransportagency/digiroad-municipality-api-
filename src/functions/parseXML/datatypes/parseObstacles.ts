import { Feature } from '@functions/typing';

export default function (esterakennelmat) {
  let features: Array<Feature> = [];
  for (const esterakennelma of esterakennelmat) {
    const feature = {
      type: 'Feature',
      properties: {
        TYPE: 'OBSTACLE',
        ID: esterakennelma['inf:yksilointitieto'],
        EST_TYYPPI: esterakennelma['inf:rakenne']
      },
      geometry: {
        type: 'Point',
        coordinates: [
          Number(
            esterakennelma['inf:tarkkaSijaintitieto']['inf:Sijainti'][
              'inf:piste'
            ]['gml:Point']['gml:coordinates'].split(',')[0]
          ),
          Number(
            esterakennelma['inf:tarkkaSijaintitieto']['inf:Sijainti'][
              'inf:piste'
            ]['gml:Point']['gml:coordinates'].split(',')[1]
          )
        ]
      }
    };
    features = features.concat(feature);
  }
  return features;
}
