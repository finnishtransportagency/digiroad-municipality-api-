import { helsinkiTrafficSignMapSchema } from '@schemas/muniResponseSchema';
import { InferType } from 'yup';

type SignMap = InferType<typeof helsinkiTrafficSignMapSchema>;

export { SignMap };
