import { Feature } from '@functions/typing';

export default function (liikennemerkit) {
  let features: Array<Feature> = [];
  for (const liikennemerkki of liikennemerkit) {
    const feature = {
      type: 'Feature',
      properties: {
        TYPE: 'TRAFFICSIGN',
        ID: liikennemerkki['inf:yksilointitieto'],
        SUUNTIMA: liikennemerkki['inf:suunta'],
        TEKSTI: liikennemerkki['inf:teksti'],
        LM_TYYPPI: liikennemerkki['inf:liikennemerkkityyppi2020'].split(' ')[0]
      },
      geometry: {
        type: 'Point',
        coordinates: [
          Number(
            liikennemerkki['inf:tarkkaSijaintitieto']['inf:Sijainti'][
              'inf:piste'
            ]['gml:Point']['gml:coordinates'].split(',')[0]
          ),
          Number(
            liikennemerkki['inf:tarkkaSijaintitieto']['inf:Sijainti'][
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
