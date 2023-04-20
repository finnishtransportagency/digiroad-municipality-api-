import { middyfy } from '@libs/lambda';
import validator from '@middy/validator';
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
        url: {
          type: 'string'
        }
      },
      required: ['municipality', 'key', 'url']
    }
  }
};

const createSchedule = async (event) => {
  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

  if (!event.body.municipality || !event.body.key || !event.body.url) {
    return {
      statusCode: 400,
      body: 'Invalid input'
    };
  }

  const putParameterInput = {
    Name: `/DRKunta/${process.env.STAGE_NAME}/${event.body.municipality}`,
    Value: event.body.key,
    Type: 'String'
  };

  const createScheduleInput = {
    Name: `DRKunta-${process.env.STAGE_NAME}-${event.body.municipality}`,
    GroupName: `DRKunta-${process.env.STAGE_NAME}`,
    ScheduleExpression: 'cron(0 10 ? * TUE *)',
    Target: {
      Arn: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityData`,
      RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityDataScheduleRole`,
      Input: `{
        "municipality": "${event.body.municipality}",
        "url": "${event.body.url}"
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
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      body: 'Schedule already exists'
    };
  }

  try {
    await scheduler.send(creteScheduleCommand);
  } catch (e) {
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
    statusCode: 201
  };
};

export const main = middyfy(createSchedule).use(
  validator({ eventSchema: inputSchema })
);
