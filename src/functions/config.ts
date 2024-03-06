export const offline = process.env.OFFLINE || false;
export const pghost = process.env.PGHOST || 'localhost';
export const pgport = process.env.PGPORT || '5432';
export const pgdatabase = process.env.PGDATABASE || 'digiroad2';
export const pguser = offline ? 'digiroad2' : process.env.PGUSER;
export const pgpassword = process.env.PGPASSWORD_SSM_KEY || 'digiroad2';
export const apikey = process.env.APIKEY || '';
export const testBbox = process.env.BBOX || '379010,6677995,378228,6677525'; // Leppävaara
