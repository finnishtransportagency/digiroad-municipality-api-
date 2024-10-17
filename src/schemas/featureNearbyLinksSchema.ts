import { array, number, object, string } from 'yup';

const featureNearbyLinksSchema = object({
  id: string().required(),
  type: string().required(),
  roadlinks: array()
    .of(
      object({
        linkId: string().required(),
        points: array()
          .of(
            object({
              x: number().required(),
              y: number().required(),
              z: number().required(),
              m: number().required()
            })
          )
          .required(),
        directiontype: number().oneOf([0, 1, 2]).required(),
        roadname: string().notRequired(),
        geometrylength: number().notRequired()
      })
    )
    .required()
});

export { featureNearbyLinksSchema };
