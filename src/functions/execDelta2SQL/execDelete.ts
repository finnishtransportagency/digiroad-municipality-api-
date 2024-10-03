import { MatchedFeature } from '@customTypes/featureTypes';
import { expireQuery } from '@libs/pg-tools';
import { assetTypeIdMap } from '@schemas/dbIdMapping';
import { Client } from 'pg';

const execDelete = async (
  feature: MatchedFeature,
  municipality_code: number,
  dbmodifier: string,
  client: Client
): Promise<void> => {
  const featureProperties = feature.properties;
  const assetTypeID = assetTypeIdMap[featureProperties.TYPE];

  await client.query(
    expireQuery(dbmodifier, featureProperties.ID, municipality_code, assetTypeID, true)
  );
};

export default execDelete;
