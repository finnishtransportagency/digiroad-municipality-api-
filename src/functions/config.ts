export const offline = process.env.OFFLINE || false;
export const pghost = process.env.PGHOST || 'localhost';
export const pgport = process.env.PGPORT || '5432';
export const pgdatabase = process.env.PGDATABASE || 'digiroad2';
export const pguser = offline ? 'digiroad2' : process.env.PGUSER;
export const pgpassword = process.env.PGPASSWORD_SSM_KEY || 'digiroad2';
export const apikey = process.env.APIKEY || '';
export const testBbox = process.env.BBOX || '379010,6677995,378228,6677525'; // Default bounding box around Leppävaara, Espoo
export const fetchSize = Number(process.env.FETCH_SIZE) || 5000; // Number of features to fetch at a time from Infra-O API

export const allowedOnKapy = [
  'A11 Tietyö',
  'A21 Tienristeys',
  'A33 Muu vaara',
  'B5 Väistämisvelvollisuus risteyksessä',
  'B6 Pakollinen pysäyttäminen',
  'C2 Moottorikäyttöisellä ajoneuvolla ajo kielletty',
  'C21 Ajoneuvon suurin sallittu leveys',
  'C22 Ajoneuvon suurin sallittu korkeus',
  'C24 Ajoneuvon suurin sallittu massa',
  'D4 Jalkakäytävä',
  'D5 Pyörätie',
  'D6 Yhdistetty pyörätie ja jalkakäytävä',
  'D7.1 Pyörätie ja jalkakäytävä rinnakkain',
  'D7.2 Pyörätie ja jalkakäytävä rinnakkain',
  'E26 Kävelykatu',
  'E27 Kävelykatu päättyy',
  'F16 Osoiteviitta',
  'F19 Jalankulun viitta',
  'F20.1 Pyöräilyn viitta',
  'F20.2 Pyöräilyn viitta',
  'F21.1 Pyöräilyn suunnistustaulu',
  'F21.2 Pyöräilyn suunnistustaulu',
  'F22 Pyöräilyn etäisyystaulu',
  'F23 Pyöräilyn paikannimi',
  'F50.9 Polkupyörälle tarkoitettu reitti',
  'F52 Jalankulkijalle tarkoitettu reitti',
  'F53 Esteetön reitti',
  'F54.1 Reitti, jolla on portaat alas',
  'F54.2 Reitti, jolla on portaat ylös',
  'F55.1 Reitti ilman portaita alas',
  'F55.2 Reitti ilman portaitaylös',
  'F55.3 Pyörätuoliramppi alas',
  'F55.4 Pyörätuoliramppi ylös',
  'F56.1 Hätäuloskäynti vasemmalla',
  'F56.2 Hätäuloskäynti oikealla',
  'F57.1 Poistumisreitti (yksi)',
  'F57.2 Poistumisreitti (useita)',
  'H23.1 Kaksisuuntainen pyörätie',
  'H23.2 Kaksisuuntainen pyörätie',
  'H24 Tekstillinen lisäkilpi',
  'H25 Huoltoajo sallittu'
];
