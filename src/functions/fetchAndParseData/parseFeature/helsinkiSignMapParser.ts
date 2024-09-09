import { SignMap } from '@customTypes/mapTypes';
import { helsinkiTrafficSignMapSchema } from '@schemas/muniResponseSchema';

export default (map: unknown): SignMap => {
  try {
    return helsinkiTrafficSignMapSchema.cast(map);
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    console.error('Error in parseMap:', e.message);
    console.info('Invalid map:', map);
    return {
      id: 'null',
      code: 'INVALID_CODE',
      legacy_code: 'INVALID_CODE'
    };
  }
};
