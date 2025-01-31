import { middyfy } from '@libs/lambda-tools';
import { bucketName } from '@functions/config';
import { getFromS3 } from '@libs/s3-tools';
import { executeTransaction } from '@libs/pg-tools';
import { isMatchedPayload, S3KeyObject } from '@customTypes/eventTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import execInsert from './execInsert';
import { municipalityCodeMap } from '@schemas/dbIdMapping';
import { Client } from 'pg';
import { QueryFunction } from '@customTypes/pgTypes';
import execDelete from './execDelete';
import {
  AdditionalPanelProperty,
  ChoiceProperty,
  NumberProperty,
  SignProperty,
  TextProperty
} from '@customTypes/propertyTypes';
import execProperties from './execProperties';

const execDelta2SQL = async (event: S3KeyObject) => {
  const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  const delta = updatePayloadSchema.cast(s3Response);
  if (!isMatchedPayload(delta))
    throw new Error(
      `S3 object ${event.key} is not valid UpdatePayload object:\n${JSON.stringify(
        delta
      ).slice(0, 1000)}`
    );

  const municipality = delta.metadata.municipality;
  const municipalityCode = municipalityCodeMap[municipality];
  const dbmodifier = `municipality-api-${municipality}`;

  const features = delta.Created.concat(delta.Updated);

  const textProperties: Array<TextProperty> = [];
  const numberProperties: Array<NumberProperty> = [];
  const singleChoiceProperties: Array<ChoiceProperty> = [];
  const trafficSignTypes: Array<SignProperty> = [];
  const multipleChoiceProperties: Array<ChoiceProperty> = [];
  const additionalPanels: Array<AdditionalPanelProperty> = [];

  const queryFunctions = features
    .map((feature): QueryFunction => {
      return async (client: Client) =>
        await execInsert(
          feature,
          municipalityCode,
          dbmodifier,
          client,
          textProperties,
          numberProperties,
          singleChoiceProperties,
          multipleChoiceProperties,
          additionalPanels,
          trafficSignTypes
        );
    })
    .concat(
      delta.Deleted.map((feature): QueryFunction => {
        return async (client: Client) =>
          await execDelete(feature, municipalityCode, dbmodifier, client);
      })
    );

  const propertyFunctions: QueryFunction = async (client: Client) => {
    await execProperties(
      dbmodifier,
      client,
      textProperties,
      numberProperties,
      singleChoiceProperties,
      multipleChoiceProperties,
      additionalPanels,
      trafficSignTypes
    );
  };

  await executeTransaction(queryFunctions, [propertyFunctions], (e) => console.error(e));
};

export const main = middyfy(execDelta2SQL);
