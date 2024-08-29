interface TrafficSignRules {
  [key: string]: {
    text: string;
    type: 'TRAFFICSIGN' | 'ADDITIONALPANEL';
    allowedOnKapy: boolean;
    maxValue: number | null;
    minValue: number | null;
    unit: string | null;
  };
}

export const trafficSignRules: TrafficSignRules = {
  'A1.1': {
    text: 'Mutka oikealle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A1.2': {
    text: 'Mutka vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A2.1': {
    text: 'Mutkia, joista ensimmäinen oikealle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A2.2': {
    text: 'Mutkia, joista ensimmäinen vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A3.1': {
    text: 'Jyrkkä ylämäki',
    maxValue: 45,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  'A3.2': {
    text: 'Jyrkkä alamäki',
    maxValue: 45,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  A4: {
    text: 'Kapeneva tie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A5: {
    text: 'Kaksisuuntainen liikenne',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A6: {
    text: 'Avattava silta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A7: {
    text: 'Lautta, laituri tai ranta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A8: {
    text: 'Liikenneruuhka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A9: {
    text: 'Epätasainen tie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A10: {
    text: 'Töyssyjä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A11: {
    text: 'Tietyö',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A12: {
    text: 'Irtokiviä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A13: {
    text: 'Liukas ajorata',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A14: {
    text: 'Vaarallinen tien reuna',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A15: {
    text: 'Suojatien ennakkovaroitus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A16: {
    text: 'Jalankulkijoita',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A17: {
    text: 'Lapsia',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A18: {
    text: 'Pyöräilijöitä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A19: {
    text: 'Hiihtolatu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A20.1': {
    text: 'Hirvi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A20.2': {
    text: 'Poro',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A20.3': {
    text: 'Kauriseläin',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A21: {
    text: 'Tienristeys',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A22.1': {
    text: 'Sivutien risteys molemmin puolin',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A22.2': {
    text: 'Sivutien risteys molemmin puolin porrastetusti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A22.3': {
    text: 'Sivutien risteys oikealla/vasemmalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A22.4': {
    text: 'Sivutien risteys oikealla/vasemmalla viistoon',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A23: {
    text: 'Liikennevalot',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A24: {
    text: 'Liikenneympyrä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A25: {
    text: 'Raitiovaunu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A26: {
    text: 'Rautatien tasoristeys ilman puomeja',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A27: {
    text: 'Rautatien tasoristeys, jossa on puomit',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A28.1': {
    text: 'Rautatien tasoristeyksen lähestymismerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A28.2': {
    text: 'Rautatien tasoristeyksen lähestymismerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A28.3': {
    text: 'Rautatien tasoristeyksen lähestymismerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A29.1': {
    text: 'Yksiraiteisen rautatien tasoristeys',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'A29.2': {
    text: 'Kaksi tai useampiraiteisen rautatien tasoristeys',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A30: {
    text: 'Putoavia kiviä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A31: {
    text: 'Matalalla lentäviä lentokoneita',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A32: {
    text: 'Sivutuuli',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  A33: {
    text: 'Muu vaara',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B1: {
    text: 'Etuajo-oikeutettu tie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B2: {
    text: 'Etuajo-oikeuden päättyminen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B3: {
    text: 'Etuajo-oikeus kohdattaessa',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B4: {
    text: 'Väistämisvelvollisuus kohdattaessa',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B5: {
    text: 'Väistämisvelvollisuus risteyksessä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B6: {
    text: 'Pakollinen pysäyttäminen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  B7: {
    text: 'Väistämisvelvollisuus pyöräilijän tienylityspaikassa',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C1: {
    text: 'Ajoneuvolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C2: {
    text: 'Moottorikäyttöisellä ajoneuvolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C3: {
    text: 'Kuorma- ja pakettiautolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C4: {
    text: 'Ajoneuvoyhdistelmällä ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C5: {
    text: 'Traktorilla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C6: {
    text: 'Moottoripyörällä ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C7: {
    text: 'Moottorikelkalla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C8: {
    text: 'Vaarallisten aineiden kuljetus kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C9: {
    text: 'Linja-autolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C10: {
    text: 'Mopolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C11: {
    text: 'Polkupyörällä ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C12: {
    text: 'Polkupyörällä ja mopolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C13: {
    text: 'Jalankulku kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C14: {
    text: 'Jalankulku ja polkupyörällä ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C15: {
    text: 'Jalankulku ja polkupyörällä ja mopolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C16: {
    text: 'Ratsastus kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C17: {
    text: 'Kielletty ajosuunta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C18: {
    text: 'Vasemmalle kääntyminen kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C19: {
    text: 'Oikealle kääntyminen kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C20: {
    text: 'U-käännös kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C21: {
    text: 'Ajoneuvon suurin sallittu leveys',
    maxValue: 2000,
    minValue: 200,
    unit: 'cm',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true
  },
  C22: {
    text: 'Ajoneuvon suurin sallittu korkeus',
    maxValue: 5000,
    minValue: 100,
    unit: 'cm',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true
  },
  C23: {
    text: 'Ajoneuvon tai ajoneuvoyhdistelmän suurin sallittu pituus',
    maxValue: 10000,
    minValue: 200,
    unit: 'cm',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C24: {
    text: 'Ajoneuvon suurin sallittu massa',
    maxValue: 100000,
    minValue: 100,
    unit: 'kg',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true
  },
  C25: {
    text: 'Ajoneuvoyhdistelmän suurin sallittu massa',
    maxValue: 100000,
    minValue: 100,
    unit: 'kg',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C26: {
    text: 'Ajoneuvon suurin sallittu akselille kohdistuva massa',
    maxValue: 100000,
    minValue: 100,
    unit: 'kg',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C27: {
    text: 'Ajoneuvon suurin sallittu telille kohdistuva massa',
    maxValue: 100000,
    minValue: 100,
    unit: 'kg',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C28: {
    text: 'Ohituskielto',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C29: {
    text: 'Ohituskielto päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C30: {
    text: 'Ohituskielto kuorma-autolla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C31: {
    text: 'Ohituskielto kuorma-autolla päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C32: {
    text: 'Nopeusrajoitus',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C33: {
    text: 'Nopeusrajoitus päättyy',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C34: {
    text: 'Nopeusrajoitusalue',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C35: {
    text: 'Nopeusrajoitusalue päättyy',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  C36: {
    text: 'Ajokaistakohtainen kielto, rajoitus tai määräys',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C37: {
    text: 'Pysäyttäminen kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C38: {
    text: 'Pysäköinti kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C39: {
    text: 'Pysäköintikieltoalue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C40: {
    text: 'Pysäköintikieltoalue päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C41: {
    text: 'Taksiasema-alue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C42: {
    text: 'Taksin pysähtymispaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C43: {
    text: 'Kuormauspaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'C44.1': {
    text: 'Vuoropysäköinti (kielletty parittomina päivinä)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'C44.2': {
    text: 'Vuoropysäköinti (kielletty parillisina päivinä)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C45: {
    text: 'Pakollinen pysäyttäminen tullitarkastusta varten',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C46: {
    text: 'Pakollinen pysäyttäminen tarkastusta varten',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  C47: {
    text: 'Moottorikäyttöisten ajoneuvojen vähimmäisetäisyys',
    maxValue: 1000,
    unit: 'm',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null
  },
  C48: {
    text: 'Nastarenkailla varustetulla moottorikäyttöisellä ajoneuvolla ajo kielletty',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.1': {
    text: 'Pakollinen ajosuunta oikealle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.2': {
    text: 'Pakollinen ajosuunta vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.3': {
    text: 'Pakollinen ajosuunta suoraan',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.4': {
    text: 'Pakollinen ajosuunta kääntyminen oikealle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.5': {
    text: 'Pakollinen ajosuunta kääntyminen vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.6': {
    text: 'Pakollinen ajosuunta suoraan tai kääntyminen oikealle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.7': {
    text: 'Pakollinen ajosuunta suoraan tai kääntyminen vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.8': {
    text: 'Pakollinen ajosuunta kääntyminen oikealle tai vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D1.9': {
    text: 'Pakollinen ajosuunta suoraan tai kääntyminen oikealle tai vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D2: {
    text: 'Pakollinen ajosuunta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D3.1': {
    text: 'Liikenteenjakaja oikea',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D3.2': {
    text: 'Liikenteenjakaja vasen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D3.3': {
    text: 'Liikenteenjakaja molemmin puolin',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D4: {
    text: 'Jalkakäytävä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D5: {
    text: 'Pyörätie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D6: {
    text: 'Yhdistetty pyörätie ja jalkakäytävä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D7.1': {
    text: 'Pyörätie ja jalkakäytävä rinnakkain, pyörätie vasemmalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'D7.2': {
    text: 'Pyörätie ja jalkakäytävä rinnakkain, pyörätie oikealla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D8: {
    text: 'Moottorikelkkailureitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D9: {
    text: 'Ratsastustie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  D10: {
    text: 'Vähimmäisnopeus',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  D11: {
    text: 'Vähimmäisnopeus päättyy',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  E1: {
    text: 'Suojatie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E2: {
    text: 'Pysäköintipaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E3.1': {
    text: 'Liityntäpysäköintipaikka juna',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E3.2': {
    text: 'Liityntäpysäköintipaikka linja-auto',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E3.3': {
    text: 'Liityntäpysäköintipaikka raitiovaunu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E3.4': {
    text: 'Liityntäpysäköintipaikka metro',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E3.5': {
    text: 'Liityntäpysäköintipaikka useita joukkoliikennevälineitä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E4.1': {
    text: 'Ajoneuvojen sijoitus pysäköintipaikalla suoraan',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E4.2': {
    text: 'Ajoneuvojen sijoitus pysäköintipaikalla vastakkain',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E4.3': {
    text: 'Ajoneuvojen sijoitus pysäköintipaikalla vinoon',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E5: {
    text: 'Kohtaamispaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E6: {
    text: 'Linja-autopysäkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E7: {
    text: 'Raitiovaunupysäkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E8: {
    text: 'Taksiasema',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E9.1': {
    text: 'Linja-autokaista',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E9.2': {
    text: 'Linja-auto ja taksikaista',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E10.1': {
    text: 'Linja-autokaista päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E10.2': {
    text: 'Linja-auto ja taksikaista päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E11.1': {
    text: 'Raitiovaunukaista',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E11.2': {
    text: 'Raitiovaunu- ja taksikaista',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E12.1': {
    text: 'Raitiovaunukaista päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E12.2': {
    text: 'Raitiovaunu- ja taksikaista päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E13.1': {
    text: 'Pyöräkaista oikealla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E13.2': {
    text: 'Pyöräkaista keskellä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E14.1': {
    text: 'Yksisuuntainen tie suoraan',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'E14.2': {
    text: 'Yksisuuntainen tie oikealle/vasemmalle',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E15: {
    text: 'Moottoritie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E16: {
    text: 'Moottoritie päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E17: {
    text: 'Moottoriliikennetie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E18: {
    text: 'Moottoriliikennetie päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E19: {
    text: 'Tunneli',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E20: {
    text: 'Tunneli päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E21: {
    text: 'Hätäpysäyttämispaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E22: {
    text: 'Taajama',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E23: {
    text: 'Taajama päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E24: {
    text: 'Pihakatu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E25: {
    text: 'Pihakatu päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E26: {
    text: 'Kävelykatu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E27: {
    text: 'Kävelykatu päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E28: {
    text: 'Pyöräkatu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E29: {
    text: 'Pyöräkatu päättyy',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  E30: {
    text: 'Ajokaistojen yhdistyminen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F1.1': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F1.2': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F1.3': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F2.1': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F2.2': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F2.3': {
    text: 'Suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F3: {
    text: 'Ajokaistakohtainen suunnistustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F4.1': {
    text: 'Kiertotien suunnistustaulu (sininen pohja)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F4.2': {
    text: 'Kiertotien suunnistustaulu (keltainen pohja)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F5: {
    text: 'Kiertotieopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F6: {
    text: 'Ajoreittiopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.1': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.2': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.3': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.4': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.5': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F7.6': {
    text: 'Ajokaistaopastus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F8.1': {
    text: 'Ajokaistan päättyminen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F8.2': {
    text: 'Ajokaistan päättyminen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F9: {
    text: 'Viitoituksen koontimerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F10: {
    text: 'Ajokaistan yläpuolinen viitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F11: {
    text: 'Ajokaistan yläpuolinen viitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F12: {
    text: 'Ajokaistan yläpuolinen erkanemisviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F13: {
    text: 'Tienviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F14: {
    text: 'Erkanemisviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F15: {
    text: 'Kiertotien viitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F16: {
    text: 'Osoiteviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F17: {
    text: 'Osoiteviitan ennakkomerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F18.1': {
    text: 'Liityntäpysäköintiviitta juna',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F18.2': {
    text: 'Liityntäpysäköintiviitta bussi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F18.3': {
    text: 'Liityntäpysäköintiviitta raitiovaunu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F18.4': {
    text: 'Liityntäpysäköintiviitta metro',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F18.5': {
    text: 'Liityntäpysäköintiviitta useita joukkoliikennevälineitä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F19: {
    text: 'Jalankulun viitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F20.1': {
    text: 'Pyöräilyn viitta ilman etäisyyksiä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F20.2': {
    text: 'Pyöräilyn viitta etäisyyslukemilla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F21.1': {
    text: 'Pyöräilyn suunnistustaulu etäisyyslukemilla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F21.2': {
    text: 'Pyöräilyn suunnistustaulu ilman etäisyyksiä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F22: {
    text: 'Pyöräilyn etäisyystaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F23: {
    text: 'Pyöräilyn paikannimi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F24.1': {
    text: 'Umpitie edessä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F24.2': {
    text: 'Umpitie oikealla/vasemmalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F24.3': {
    text: 'Umpitie',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F25: {
    text: 'Enimmäisnopeussuositus',
    maxValue: 120,
    minValue: 10,
    unit: 'km/h',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false
  },
  F26: {
    text: 'Etäisyystaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F27.1': {
    text: 'Paikannimi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F27.2': {
    text: 'Vesistön nimi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F28: {
    text: 'Kansainvälisen pääliikenneväylän numero',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F29: {
    text: 'Valtatien numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F30: {
    text: 'Kantatien numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F31: {
    text: 'Seututien numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F32: {
    text: 'Muun maantien numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F33: {
    text: 'Kehätien numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F34: {
    text: 'Eritasoliittymän numero',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F35: {
    text: 'Opastus merkin tarkoittamalle tielle',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F36: {
    text: 'Varareitti',
    maxValue: 100000,
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null,
    unit: null
  },
  F37: {
    text: 'Moottoritien tunnus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F38: {
    text: 'Moottoriliikennetien tunnus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F39: {
    text: 'Lentoasema',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F40: {
    text: 'Autolautta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F41: {
    text: 'Matkustajasatama',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F42: {
    text: 'Tavarasatama',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F43: {
    text: 'Tavaraterminaali',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F44: {
    text: 'Teollisuusalue tai yritysalue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F45: {
    text: 'Vähittäiskaupan suuryksikkö',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F46.1': {
    text: 'Pysäköinti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F46.2': {
    text: 'Katettu pysäköinti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F47: {
    text: 'Rautatieasema',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F48: {
    text: 'Linja-autoasema',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F49: {
    text: 'Keskusta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F50: {
    text: 'Tietylle ajoneuvolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.1': {
    text: 'Kuorma-autolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.2': {
    text: 'Henkilöautolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.3': {
    text: 'Linja-autolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.4': {
    text: 'Pakettiautolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.5': {
    text: 'Moottoripyörälle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.6': {
    text: 'Mopolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.7': {
    text: 'Traktorille tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.8': {
    text: 'Matkailuajoneuvolle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F50.9': {
    text: 'Polkupyörälle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F51: {
    text: 'Vaarallisten aineiden kuljetukselle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F52: {
    text: 'Jalankulkijalle tarkoitettu reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  F53: {
    text: 'Esteetön reitti',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F54.1': {
    text: 'Reitti, jolla on portaat alas',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F54.2': {
    text: 'Reitti, jolla on portaat ylös',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F55.1': {
    text: 'Reitti ilman portaita alas',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F55.2': {
    text: 'Reitti ilman portaita ylös',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F55.3': {
    text: 'Pyörätuoliramppi alas',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F55.4': {
    text: 'Pyörätuoliramppii ylös',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F56.1': {
    text: 'Hätäuloskäynti vasemmalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F56.2': {
    text: 'Hätäuloskäynti oikealla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F57.1': {
    text: 'Poistumisreitti (yksi)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'F57.2': {
    text: 'Poistumisreitti (useita)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G1: {
    text: 'Palvelukohteen opastustaulu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G2: {
    text: 'Palvelukohteen opastustaulu nuolella',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G3: {
    text: 'Palvelukohteen erkanemisviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G4: {
    text: 'Palvelukohteen osoiteviitta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G5: {
    text: 'Palvelukohteen osoiteviitan ennakkomerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G6: {
    text: 'Radioaseman taajuus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G7: {
    text: 'Opastuspiste',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G8: {
    text: 'Opastustoimisto',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G9: {
    text: 'Ensiapu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G10: {
    text: 'Autokorjaamo',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G11.1': {
    text: 'Polttoaineen jakelu bensiini tai etanoli',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G11.2': {
    text: 'Polttoaineen jakelu paineistettu maakaasu',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G11.3': {
    text: 'Polttoaineen jakelu sähkö',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G11.4': {
    text: 'Polttoaineen jakelu vety',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G12: {
    text: 'Hotelli tai motelli',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G13: {
    text: 'Ruokailupaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G14: {
    text: 'Kahvila tai pikaruokapaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G15: {
    text: 'Käymälä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G16: {
    text: 'Retkeilymaja',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G17: {
    text: 'Leirintäalue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G18: {
    text: 'Matkailuajoneuvoalue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G19: {
    text: 'Levähdysalue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G20: {
    text: 'Ulkoilualue',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G21: {
    text: 'Hätäpuhelin',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G22: {
    text: 'Sammutin',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G23: {
    text: 'Museo tai historiallinen rakennus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G24: {
    text: 'Maailmanperintökohde',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G25: {
    text: 'Luontokohde',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G26: {
    text: 'Näköalapaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G27: {
    text: 'Eläintarha tai -puisto',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G28: {
    text: 'Muu nähtävyys',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G29: {
    text: 'Uintipaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G30: {
    text: 'Kalastuspaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G31: {
    text: 'Hiihtohissi',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G32: {
    text: 'Maastohiihtokeskus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G33: {
    text: 'Golfkenttä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G34: {
    text: 'Huvi- ja teemapuisto',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G35: {
    text: 'Mökkimajoitus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G36: {
    text: 'Aamiaismajoitus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G37: {
    text: 'Suoramyyntipaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G38: {
    text: 'Käsityöpaja',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G39: {
    text: 'Kotieläinpiha',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  G40: {
    text: 'Ratsastuspaikka',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G41.1': {
    text: 'Matkailutie (pelkkä teksti)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'G41.2': {
    text: 'Matkailutie (kuva ja teksti)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I5: {
    text: 'Taustamerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I6: {
    text: 'Kaarteen suuntamerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'I7.1': {
    text: 'Reunamerkki vasemmalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'I7.2': {
    text: 'Reunamerkki oikealla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I8: {
    text: 'Korkeusmerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I9: {
    text: 'Alikulun korkeusmitta',
    maxValue: 45,
    unit: 'm',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    minValue: null
  },
  'I10.1': {
    text: 'Liikennemerkkipylvään tehostamismerkki (sinivalkoinen)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'I10.2': {
    text: 'Liikennemerkkipylvään tehostamismerkki (keltamusta)',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I11: {
    text: 'Erkanemismerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I13: {
    text: 'Siirtokehotus',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I14: {
    text: 'Paikannusmerkki',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I15: {
    text: 'Automaattinen liikennevalvonta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I16: {
    text: 'Tekninen valvonta',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'I17.1': {
    text: 'Poronhoitoalue tekstillinen',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'I17.2': {
    text: 'Poronhoitoalue ilman tekstiä',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I18: {
    text: 'Yleinen nopeusrajoitus rajalla',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  I19: {
    text: 'Valtion raja',
    type: 'TRAFFICSIGN',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H1: {
    text: 'Kohde risteävässä suunnassa',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H2.1': {
    text: 'Kohde nuolen suunnassa',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H2.2': {
    text: 'Kohde nuolen suunnassa ja etäisyys',
    maxValue: 100,
    unit: 'km',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  'H2.3': {
    text: 'Kohde edessä ja etäisyys',
    maxValue: 100,
    unit: 'km',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H3: {
    text: 'Vaikutusalueen pituus',
    maxValue: 100,
    unit: 'km',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H4: {
    text: 'Etäisyys kohteeseen',
    maxValue: 10000,
    unit: 'm',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H5: {
    text: 'Etäisyys pakolliseen pysäyttämiseen',
    maxValue: 10000,
    unit: 'm',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H6: {
    text: 'Vapaa leveys',
    maxValue: 20,
    unit: 'm',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H7: {
    text: 'Vapaa korkeus',
    maxValue: 50,
    unit: 'm',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H8: {
    text: 'Sähköjohdon korkeus',
    maxValue: 100,
    unit: 'm',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  'H9.1': {
    text: 'Vaikutusalue molempiin suuntiin oikealle ja vasemmalle',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H9.2': {
    text: 'Vaikutusalue molempiin suuntiin eteen- ja taaksepäin',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H10: {
    text: 'Vaikutusalue nuolen suuntaan',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H11: {
    text: 'Vaikutusalue päättyy',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.1': {
    text: 'Henkilöauto',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.2': {
    text: 'Linja-auto',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.3': {
    text: 'Kuorma-auto',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.4': {
    text: 'Pakettiauto',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.5': {
    text: 'Matkailuperävaunu',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.6': {
    text: 'Matkailuauto',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.7': {
    text: 'Invalidin ajoneuvo',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.8': {
    text: 'Moottoripyörä',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.9': {
    text: 'Mopo',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.10': {
    text: 'Polkupyörä',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.11': {
    text: 'Moottorikelkka',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.12': {
    text: 'Traktori',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H12.13': {
    text: 'Vähäpäästöinen ajoneuvo',
    maxValue: 10000,
    unit: 'g/km',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  'H13.1': {
    text: 'Pysäköintitapa reunakiven päälle',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H13.2': {
    text: 'Pysäköintitapa reunakiven laitaan',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H14: {
    text: 'Kielto ryhmän A vaarallisten aineiden kuljetukselle',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H15: {
    text: 'Kielto ryhmän B vaarallisten aineiden kuljetukselle',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H16: {
    text: 'Tunneliluokka',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H17.1': {
    text: 'Voimassaoloaika arkisin ma-pe',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H17.2': {
    text: 'Voimassaoloaika arkilauantaisin',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H17.3': {
    text: 'Voimassaoloaika sunnuntaisin ja pyhinä',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H18: {
    text: 'Aikarajoitus',
    maxValue: 2000,
    unit: 'min',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  'H19.1': {
    text: 'Pysäköintiajan alkamisen osoittamisvelvollisuus (keltainen pohja)',
    maxValue: 2000,
    unit: 'min',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  'H19.2': {
    text: 'Pysäköintiajan alkamisen osoittamisvelvollisuus (sininen pohja)',
    maxValue: 2000,
    unit: 'min',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    minValue: null
  },
  H20: {
    text: 'Maksullinen pysäköinti',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H21: {
    text: 'Latauspaikka',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H22.1': {
    text: 'Etuajo-oikeutetun liikenteen suunta',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H22.2': {
    text: 'Etuajo-oikeutetun liikenteen suunta kääntyville',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H23.1': {
    text: 'Kaksisuuntainen pyörätie (keltainen pohja)',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  'H23.2': {
    text: 'Kaksisuuntainen pyörätie (sininen pohja)',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H24: {
    text: 'Tekstillinen lisäkilpi',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H25: {
    text: 'Huoltoajo sallittu',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: true,
    maxValue: null,
    minValue: null,
    unit: null
  },
  H26: {
    text: 'Hätäpuhelin ja sammutin',
    type: 'ADDITIONALPANEL',
    allowedOnKapy: false,
    maxValue: null,
    minValue: null,
    unit: null
  }
};

/**
 * Creates a string from the traffic sign code corresponding to the value in Digiroad database.
 * @param trafficSignCode e.g. 'A1.1'
 * @returns e.g. 'A1.1 Mutka oikealle'
 */
export const createTrafficSignText = (trafficSignCode: string): string =>
  `${trafficSignCode} ${trafficSignRules[trafficSignCode].text}`;

/**
 * Traffic sign codes allowed in Digiroad database.
 * @example ['A1.1 Mutka oikealle', 'A1.2 Mutka vasemmalle', ...]
 */
export const allowedTrafficSigns = Object.keys(trafficSignRules)
  .filter((trafficSignCode) => trafficSignRules[trafficSignCode].type === 'TRAFFICSIGN')
  .map(createTrafficSignText);

/**
 * Additional panel codes allowed in Digiroad database.
 * @example ['H1 Kohde risteävässä suunnassa', 'H2.1 Kohde nuolen suunnassa', ...]
 */
export const allowedAdditionalPanels = Object.keys(trafficSignRules)
  .filter(
    (trafficSignCode) => trafficSignRules[trafficSignCode].type === 'ADDITIONALPANEL'
  )
  .map(createTrafficSignText);

/**
 * Traffic sign codes for traffic signs allowed on pedestrian and cycle paths.
 * @example ['A11 Tietyö', 'A21 Tienristeys', ...]
 */
export const allowedOnKapy = Object.keys(trafficSignRules)
  .filter((trafficSignCode) => trafficSignRules[trafficSignCode].allowedOnKapy)
  .map(createTrafficSignText);
