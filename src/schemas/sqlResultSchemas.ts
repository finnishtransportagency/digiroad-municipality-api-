import { array, number, object, string } from 'yup';
import { GeoJsonFeatureType } from './geoJsonSchema';

const pointQueryResultSchema = object({
  id: string().required(),
  type: string()
    .oneOf([GeoJsonFeatureType.Obstacle, GeoJsonFeatureType.TrafficSign])
    .required(),
  roadlinks: array()
    .of(
      object({
        f1: string()
          .matches(
            /^LINESTRING ZM \(\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?(, \d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?)*\)$/
          )
          .required(),
        f2: string()
          .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\d+$/)
          .required(),
        f3: number().required(),
        f4: string().notRequired()
      })
    )
    .required()
}).required();

export { pointQueryResultSchema };
