import { ObstacleFeature } from '@functions/typing';
import { Client } from 'pg';

export default async function (
  feature: ObstacleFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
) {
  const assetMunicipalityQuery = {
    text: `
      SELECT asset_id
      FROM municipality_asset_id_mapping
      WHERE municipality_asset_id=($1) AND municipality_code=($2)
    `,
    values: [feature.properties.ID, municipality_code]
  };

  const assetMunicipalityResult = await client.query(assetMunicipalityQuery);

  if (!assetMunicipalityResult.rows[0]) {
    return;
  }

  const asset_id: number = parseInt(assetMunicipalityResult.rows[0].asset_id);

  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki', MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Helsinki'
        WHERE id=($2)
        `,
    values: [dbmodifier, asset_id]
  };
  await client.query(assetQuery);
  return;
}
