import { middyfy } from '@libs/lambda-tools';
import { bucketName } from '@functions/config';
import { deleteFromS3, getFromS3 } from '@libs/s3-tools';
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
  try {
    const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
    const delta = updatePayloadSchema.cast(s3Response);

    if (!isMatchedPayload(delta)) {
      throw new Error(`S3 object ${event.key} is not valid UpdatePayload object`);
    }

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

    const queryFunctions = features.map((feature): QueryFunction => {
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
    });

    const deleteFunctions = delta.Deleted.map((feature): QueryFunction => {
      return async (client: Client) =>
        await execDelete(feature, municipalityCode, dbmodifier, client);
    });

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

    await executeTransaction(
      [...queryFunctions, ...deleteFunctions],
      [propertyFunctions],
      (error) => {
        console.error(`Error in execDelta2SQL: ${error.message}`);

        const deleteKey = `geojson/${event.key.split('/')[1]}/${
          event.key.split('/')[2]
        }/${event.key.split('/')[3]}`;

        deleteFromS3(bucketName, deleteKey)
          .then(() => console.log(`Deleted ${deleteKey} due to execDelta2SQL failure.`))
          .catch((deleteError) => {
            if (!(deleteError instanceof Error)) throw deleteError;
            console.error(`Failed to delete ${deleteKey}: ${deleteError.message}`);
          });
      }
    );
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    console.error(`Fatal error in execDelta2SQL: ${error.message}`);
    const deleteKey = `geojson/${event.key.split('/')[1]}/${event.key.split('/')[2]}/${
      event.key.split('/')[3]
    }`;

    try {
      await deleteFromS3(bucketName, deleteKey);
      console.log(`Deleted ${deleteKey} due to execDelta2SQL failure.`);
    } catch (deleteError) {
      if (!(deleteError instanceof Error)) throw deleteError;
      console.error(`Failed to delete ${deleteKey}: ${deleteError.message}`);
    }
  }
};

export const main = middyfy(execDelta2SQL);
