const infraoSurface2digiroad = {
  asfalttipäällyste: 10,
  asfalttibetoni: 10,
  betonilaatta: 1,
  'betonikivi- ja -laattapäällyste': 1,
  'betonipäällyste (valettavat)': 1,
  'emulsiopintaus (LP)': 30,
  kenttäkivetys: 2,
  liuskekivetys: 2,
  luonnonkivilaatoitus: 2,
  metallirakenne: 50,
  murskepäällyste: 40,
  noppakivetys: 2,
  nupukivetys: 2,
  puupäällyste: 50,
  'sirotepintaus (SIP)': 30,
  sorapäällyste: 40,
  'soratien pintaus (SOP)': 30,
  muu: 50
};

export default function (alue, now) {
  const pinnoite = infraoSurface2digiroad[alue['pintamateriaali']];
  if (!pinnoite) {
    return;
  }
  if (alue.loppuHetki && alue.loppuHetki < now) return;
  const multipolygon = [[]];
  const locationData = alue['sijaintitieto']['Sijainti']['alue'];
  if (!locationData) return;
  const polygon = locationData['Polygon'];
  if (!polygon) return;
  const exteriorRing = polygon['exterior']['LinearRing']['pos'];
  const exteriorPolygon = [];
  for (let i = 0; i < exteriorRing.length; i++) {
    exteriorPolygon[i] = exteriorRing[i].split(' ').slice(0, 2);
  }
  multipolygon[0][0] = exteriorPolygon;
  const interiorRings = polygon['interior'];
  if (interiorRings) {
    for (let ring = 0; ring < interiorRings.length; ring++) {
      const interiorRing = interiorRings[ring]['LinearRing']['pos'];
      const interiorPolygon = [];
      for (let i = 0; i < interiorRing.length; i++) {
        interiorPolygon[i] = interiorRing[i].split(' ').slice(0, 2);
      }
      multipolygon[0][ring + 1] = interiorPolygon;
    }
  }
  const feature = {
    type: 'Feature',
    properties: {
      TYPE: 'SURFACE',
      P_TYYPPI: infraoSurface2digiroad[alue['pintamateriaali']]
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: multipolygon
    }
  };

  return feature;
}
