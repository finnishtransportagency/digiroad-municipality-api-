import { number, object, string } from 'yup';

const expireResultSchema = object({
  created_by: string().required(),
  created_date: string().required()
});

const insertAssetResultSchema = object({
  id: number().required()
});

export { expireResultSchema, insertAssetResultSchema };
