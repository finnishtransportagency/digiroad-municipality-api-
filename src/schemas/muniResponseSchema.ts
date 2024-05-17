import { array, number, object, string } from 'yup';

/**
 * Shallow check for the most important fields
 */
const infraoJsonSchema = object().shape({
  type: string()
    .required()
    .matches(/(^FeatureCollection$)/),
  numberReturned: number().required(),
  features: array().required() // Content in not checked
});

export { infraoJsonSchema };
