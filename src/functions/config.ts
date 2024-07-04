export const offline = process.env.OFFLINE === 'true';
export const stage = process.env.STAGE_NAME || 'dev';
export const pghost = process.env.PGHOST || 'localhost';
export const pgport = process.env.PGPORT || '5432';
export const pgdatabase = process.env.PGDATABASE || 'digiroad2';
export const pguser = offline ? 'digiroad2' : process.env.PGUSER;
export const pgpassword = process.env.PGPASSWORD_SSM_KEY || 'digiroad2';
export const offlineApiKey = process.env.APIKEY || '';
const testBbox = process.env.BBOX || '379010,6677995,378228,6677525'; // Default bounding box around Leppävaara, Espoo
export const bbox = offline
  ? `&bbox=${testBbox}&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/3067`
  : '';
export const fetchSize = Number(process.env.FETCH_SIZE) || 5000; // Number of features to fetch at a time from Infra-O API
