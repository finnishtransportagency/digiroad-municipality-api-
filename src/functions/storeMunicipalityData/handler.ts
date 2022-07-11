import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import * as aws from "aws-sdk";

import schema from "./schema";

const storeMunicipalityData: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  
  const s3 = new aws.S3();
  
  try {
  const url: string = s3.getSignedUrl(
    "putObject",
    {
      Bucket: "dr-kunta-dev-bucket",
      Expires: 60 * 60,
      Key: "municipalityX/dateX",
    }
  );
  return formatJSONResponse({
    message: url
  });
} catch (err) {
  console.log(err)
  return formatJSONResponse({
    message: "Something went wrong"
  })
}
};

export const main = middyfy(storeMunicipalityData);
