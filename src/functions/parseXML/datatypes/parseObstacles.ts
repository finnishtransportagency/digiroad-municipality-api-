import { Feature } from '@functions/typing';

export default function (rakenne) {
  const feature = {
    type: 'Feature',
    properties: {
      TYPE: 'OBSTACLE',
      ID: rakenne['yksilointitieto'],
      EST_TYYPPI: 1 //esterakennelma.rakenne
    },
    geometry: {
      type: 'Point',
      coordinates: [
        Number(
          rakenne['tarkkaSijaintitieto']['Sijainti']['piste']['Point'][
            'pos'
          ].split(' ')[0]
        ),
        Number(
          rakenne['tarkkaSijaintitieto']['Sijainti']['piste']['Point'][
            'pos'
          ].split(' ')[1]
        )
      ]
    }
  };
  return feature;
}
