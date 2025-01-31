import {
  AdditionalPanelProperty,
  ChoiceProperty,
  NumberProperty,
  SignProperty,
  TextProperty
} from '@customTypes/propertyTypes';
import {
  insertAdditionalPanelsBatch,
  insertMultipleChoicePropertiesBatch,
  insertNumberPropertiesBatch,
  insertSignTypesBatch,
  insertSingleChoicePropertiesBatch,
  insertTextPropertiesBatch
} from '@libs/pg-tools';
import { Client } from 'pg';

const execProperties = async (
  dbmodifier: string,
  client: Client,
  textProperties: Array<TextProperty>,
  numberProperties: Array<NumberProperty>,
  singleChoiceProperties: Array<ChoiceProperty>,
  multipleChoiceProperties: Array<ChoiceProperty>,
  additionalPanels: Array<AdditionalPanelProperty>,
  trafficSignTypes: Array<SignProperty>
): Promise<void> => {
  await Promise.all([
    client.query(insertNumberPropertiesBatch(numberProperties)),
    client.query(insertTextPropertiesBatch(textProperties, dbmodifier)),
    client.query(insertSingleChoicePropertiesBatch(singleChoiceProperties, dbmodifier)),
    client.query(
      insertMultipleChoicePropertiesBatch(multipleChoiceProperties, dbmodifier)
    ),
    client.query(insertSignTypesBatch(trafficSignTypes, dbmodifier)),
    client.query(insertAdditionalPanelsBatch(additionalPanels))
  ]);
};

export default execProperties;
