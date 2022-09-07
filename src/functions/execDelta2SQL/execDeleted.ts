import { ObstacleFeature } from '@functions/typing';
import { Client } from 'pg';

export default async function (
  feature: ObstacleFeature,
  municipality_code: number,
  client: Client
) {
  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP, MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP
        WHERE external_id=($2) AND municipality_code=($3)
        `,
    values: ['municipality-api', feature.properties.ID, municipality_code]
  };
  await client.query(assetQuery);
  return;
}
