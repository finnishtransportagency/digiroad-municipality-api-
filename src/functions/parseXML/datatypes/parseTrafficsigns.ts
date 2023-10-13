import { oldTrafficSignMapping } from './trafficSignMapping';

export default function (liikennemerkki, now) {
  if (liikennemerkki.loppuHetki && liikennemerkki.loppuHetki < now) return;
  const trafficSignType =
    liikennemerkki.liikennemerkkityyppi2020 !== 'ei tiedossa'
      ? liikennemerkki.liikennemerkkityyppi2020
      : oldTrafficSignMapping[liikennemerkki.liikennemerkkityyppi];
  if (!trafficSignType) return;

  const feature = {
    type: 'Feature',
    properties: {
      TYPE: trafficSignType[0] === 'H' ? 'ADDITIONALPANEL' : 'TRAFFICSIGN',
      ID: liikennemerkki['yksilointitieto'],
      SUUNTIMA: liikennemerkki['suunta'] * (180 / Math.PI),
      TEKSTI: liikennemerkki['teksti'],
      LM_TYYPPI: trafficSignType,
      ...(!(trafficSignType[0] === 'H') && {
        LISAKILVET: []
      })
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
