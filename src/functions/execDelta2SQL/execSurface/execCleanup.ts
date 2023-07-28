import { Client } from 'pg';

export default async function execCleanUp(
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const assetTypeID = 110;
  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE municipality_code=($2) AND asset_type_id=($3) AND valid_to IS NULL AND created_by=($1)
        `,
    values: [dbmodifier, municipality_code, assetTypeID]
  };
  await client.query(assetQuery);
  return;
}
