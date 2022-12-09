import { ObstacleFeature } from '@functions/typing';
import { Client } from 'pg';

export default async function (
  feature: ObstacleFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE external_id=($2) AND municipality_code=($3) AND valid_to IS NULL
        `,
    values: [dbmodifier, feature.properties.ID, municipality_code]
  };
  await client.query(assetQuery);
  return;
}
