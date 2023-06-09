export default function (liikennemerkki) {
  const feature = {
    type: 'Feature',
    properties: {
      TYPE: 'TRAFFICSIGN',
      ID: liikennemerkki['yksilointitieto'],
      SUUNTIMA: liikennemerkki['suunta'],
      TEKSTI: liikennemerkki['teksti'],
      LM_TYYPPI: 'D6' //For testing
    },
    geometry: {
      type: 'Point',
      coordinates: [
        Number(
          liikennemerkki['tarkkaSijaintitieto']['Sijainti']['piste']['Point'][
            'pos'
          ].split(' ')[0]
        ),
        Number(
          liikennemerkki['tarkkaSijaintitieto']['Sijainti']['piste']['Point'][
            'pos'
          ].split(' ')[1]
        )
      ]
    }
  };
  return feature;
}
