export default async function (feature, municipality_code, client) {
  const assetQuery = {
    text: `
        UPDATE asset
        SET VALID_TO=CURRENT_TIMESTAMP, MODIFIED_BY=($1),modified_date=CURRENT_TIMESTAMP
        WHERE external_id=($2) AND municipality_code=($3)
        `,
    values: ['test-modifier', feature.properties.ID, municipality_code]
  };
  await client.query(assetQuery);
  return;
}
