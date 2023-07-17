import { TrafficSignProperties, Feature } from '@functions/typing';
import { Client } from 'pg';

export default async function execExpiredTrafficSign(
  feature: Feature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const trafficSignProperties: TrafficSignProperties =
    feature.properties as TrafficSignProperties;

  const assetTypeID = 300;

  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE external_id=($2) AND municipality_code=($3) AND asset_type_id=($4) AND valid_to IS NULL
        `,
    values: [
      dbmodifier,
      trafficSignProperties.ID,
      municipality_code,
      assetTypeID
    ]
  };
  await client.query(assetQuery);
  return;
}
