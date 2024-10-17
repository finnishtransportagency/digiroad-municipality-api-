export const offline = process.env.OFFLINE === 'true';
export const stage = process.env.STAGE_NAME || 'dev';
export const bucketName = `dr-kunta-${stage}-bucket`;
export const pghost = process.env.PGHOST || 'localhost';
export const pgport = parseInt(process.env.PGPORT || '5432');
export const pgdatabase = process.env.PGDATABASE || 'digiroad2';
export const pguser = offline ? 'digiroad2' : process.env.PGUSER || '';
export const pgpassword = process.env.PGPASSWORD_SSM_KEY || 'digiroad2';
export const offlineApiKey = process.env.APIKEY || '';
const testBbox = process.env.BBOX || '379010,6677995,378228,6677525'; // Default bounding box around Leppävaara, Espoo
export const bbox = offline
  ? `&bbox=${testBbox}&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/3067`
  : '';
export const helsinkiBbox = offline
  ? '&location=Polygon%20%28%2825497855.28718995%206673715.44330349%2C%2025497836.8154893%206673195.1570689%2C%2025497593.60476426%206672748.75763686%2C%2025497350.39403922%206672474.76074409%2C%2025495607.89694586%206672431.66010927%2C%2025495281.56356796%206673746.22947122%2C%2025496134.340414%206673850.90244149%2C%2025496288.27125263%206674860.68874294%2C%2025497719.82805194%206675147.0001028%2C%2025497855.28718995%206673715.44330349%29%29'
  : '';
export const fetchSize = Number(process.env.FETCH_SIZE) || 5000; // Number of features to fetch at a time from Infra-O API
export const drsubnetid1 = process.env.DR_SUBNET_ID_1 || '';
export const drsubnetid2 = process.env.DR_SUBNET_ID_2 || '';
export const subnetid1 = process.env.SUBNET_ID_1 || '';
export const subnetid2 = process.env.SUBNET_ID_2 || '';
export const securitygroupid = process.env.SECURITY_GROUP_ID || '';
export const vpcid = process.env.VPC_ID || '';
export const smtpusername = process.env.SMTP_USERNAME_SSM_KEY || '';
export const smtppassword = process.env.SMTP_PASSWORD_SSM_KEY || '';
export const email = process.env.OPERATOR_EMAIL || '';
export const drsecuritygroupid = process.env.DR_SECURITY_GROUP_ID || '';
export const awsaccountid = process.env.AWS_ACCOUNT_ID || '';
/**
 * Maximum offset from the middle of the linestring when matching obstacles and traffic signs
 */
export const MAX_OFFSET = Number(process.env.MAX_OFFSET) || 15;
export const supportedMunicipalities = ['espoo', 'helsinki'] as const;
