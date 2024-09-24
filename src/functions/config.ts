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
export const MAX_OFFSET = Number(process.env.MAX_OFFSET) || 5;
