import { middyfy } from '@libs/lambda-tools';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import { transpileSchema } from '@middy/validator/transpile';
import {
  SSM,
  PutParameterCommand,
  DeleteParameterCommand
} from '@aws-sdk/client-ssm';
import {
  SchedulerClient,
  CreateScheduleCommand
} from '@aws-sdk/client-scheduler';

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        municipality: { type: 'string', pattern: '^[a-z]{2,18}$' },
        key: { type: 'string', pattern: '^[a-zA-Z0-9]*$' },
        url: { type: 'string' },
        format: { type: 'string', pattern: '^(json|xml)$' },
        assetTypes: {
          type: 'object',
          properties: {
            obstacles: { type: 'string' },
            trafficSigns: { type: 'string' },
            roadSurfaces: { type: 'string' }
          },
          minProperties: 1,
          maxProperties: 3,
          additionalProperties: false
        },
        schedule: {
          type: 'object',
          properties: {
            dayOfWeek: { type: 'integer', minimum: 1, maximum: 7 },
            dayOfMonth: { type: 'integer', minimum: 1, maximum: 31 },
            time: { type: 'integer', minimum: 0, maximum: 23 }
          }
        }
      },
      required: ['municipality', 'key', 'url', 'format', 'assetTypes']
    }
  }
};

const createSchedule = async (event) => {
  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

  const putParameterInput = {
    Name: `/DRKunta/${process.env.STAGE_NAME}/${event.body.municipality}`,
    Value: event.body.key,
    Type: 'String'
  };

  const toCron = (schedule) => {
    let time: string;
    if (schedule.dayOfWeek && schedule.time) {
      time = `cron(0 ${schedule.time} ? * ${(schedule.dayOfWeek % 7) + 1} *)`;
    } else if (schedule.dayOfMonth && schedule.time) {
      time = `cron(0 ${schedule.time} ${schedule.dayOfMonth} * ? *)`;
    } else {
      console.error(
        'Invalid schedule, time and dayOfWeek or dayOfMonth required'
      );
    }
    return time;
  };

  const schedule = event.body.schedule
    ? toCron(event.body.schedule)
    : 'cron(0 10 ? * TUE *)';

  if (!schedule) {
    return {
      statusCode: 400,
      body: 'Invalid schedule, time and dayOfWeek/dayOfMonth are required'
    };
  }
  const createScheduleInput = {
    Name: `DRKunta-${process.env.STAGE_NAME}-${event.body.municipality}`,
    GroupName: `DRKunta-${process.env.STAGE_NAME}`,
    ScheduleExpression: schedule,
    Target: {
      Arn: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityData`,
      RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityDataScheduleRole`,
      Input: `{
        "municipality": "${event.body.municipality}",
        "url": "${event.body.url}",
        "format": "${event.body.format}",
        "assetTypes": ${JSON.stringify(event.body.assetTypes)}
        }`
    },
    FlexibleTimeWindow: {
      Mode: 'OFF'
    }
  };
  const putParameterCommand = new PutParameterCommand(putParameterInput);
  const creteScheduleCommand = new CreateScheduleCommand(createScheduleInput);

  try {
    await ssm.send(putParameterCommand);
  } catch (e: unknown) {
    console.error(e);
    return {
      statusCode: 400,
      body: 'Schedule already exists'
    };
  }

  try {
    await scheduler.send(creteScheduleCommand);
  } catch (e: unknown) {
    const deleteParameterInput = {
      Name: `/DRKunta/${process.env.STAGE_NAME}/${event.body.municipality}`
    };
    const deleteParameterCommand = new DeleteParameterCommand(
      deleteParameterInput
    );
    await ssm.send(deleteParameterCommand);
    console.error(e);
    return {
      statusCode: 400,
      body: 'Schedule already exists'
    };
  }
  return {
    statusCode: 201,
    body: `Successfully added schedule for ${event.body.municipality}`
  };
};

export const main = middyfy(createSchedule)
  .use(validator({ eventSchema: transpileSchema(inputSchema) }))
  .use(httpErrorHandler());
