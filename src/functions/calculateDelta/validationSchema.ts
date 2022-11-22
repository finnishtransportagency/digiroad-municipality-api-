import * as yup from 'yup';

yup.addMethod(yup.object, 'oneOfSchemas', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Feature does not match one of the allowed schemas',
    (item) => {
      return schemas.some((schema) =>
        schema.isValidSync(item, { strict: true })
      );
    }
  );
});

yup.addMethod(yup.array, 'oneOfSchemasArray', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Not all features match one of the allowed schemas',
    (items) =>
      items.every((item) => {
        return schemas.some((schema) =>
          schema.isValidSync(item, { strict: true })
        );
      })
  );
});

//NOT ACTUAL!
const trafficSignPropertiesSchema = yup.object().shape({
  ID: yup.number().required(),
  LM_TYYPPI: yup.number().required().oneOf([1, 2, 3, 99])
});

const obstaclePropertiesSchema = yup.object().shape({
  ID: yup.number().required(),
  EST_TYYPPI: yup.number().required().oneOf([1, 2])
});

const pointGeometrySchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .matches(/(Point)/),
  coordinates: yup.array().of(yup.number().required()).length(2)
});

const pointFeatureSchema = yup.object().shape({
  type: yup.string().required(),
  properties: yup
    .object()
    .oneOfSchemas([obstaclePropertiesSchema, trafficSignPropertiesSchema])
    .required(),
  geometry: pointGeometrySchema.required()
});

const crsSchema = yup.object().shape({
  type: yup.string().notRequired(),
  properties: yup
    .object()
    .shape({
      name: yup.string().notRequired()
    })
    .notRequired()
});

const schema = yup.object().shape({
  type: yup.string().required(),
  name: yup.string().notRequired(),
  crs: crsSchema.notRequired(),
  features: yup.array().oneOfSchemasArray([pointFeatureSchema])
});

export { schema, obstaclePropertiesSchema };
