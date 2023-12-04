export const offline = process.env.OFFLINE || false;
export const pghost = process.env.PGHOST || 'localhost';
export const pgport = process.env.PGPORT || '5432';
export const pgdatabase = process.env.PGDATABASE || 'digiroad2';
export const pguser = process.env.PGUSER || 'digiroad2';
export const pgpassword = process.env.PGPASSWORD_SSM_KEY || 'digiroad2';
export const apikey = process.env.APIKEY || '';