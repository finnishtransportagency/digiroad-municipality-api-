import { middyfy } from '@libs/lambda';
import {
  SSM,
  GetParameterCommand,
  PutParameterCommand
} from '@aws-sdk/client-ssm';
import {
  SchedulerClient,
  CreateScheduleCommand,
  GetScheduleCommand
} from '@aws-sdk/client-scheduler';

const createSchedule = async (event) => {
  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

  const getParameterCommand = new GetParameterCommand({
    Name: `DRKunta/${process.env.STAGE_NAME}/${event.municipality}`,
    WithDecryption: true
  });
  const getParameterResult = await ssm.send(getParameterCommand);

  const getScheduleCommand = new GetScheduleCommand({
    Name: `DRKunta-${process.env.STAGE_NAME}-${event.municipality}`
  });

  const getScheduleResult = await scheduler.send(getScheduleCommand);

  if (getParameterResult.Parameter || getScheduleResult.Arn) {
    return {
      statusCode: 400,
      body: 'Resource already exists'
    };
  }

  const putParameterInput = {
    Name: `/DRKunta/${process.env.STAGE_NAME}/${event.municipality}`,
    Value: event.key,
    Type: 'String'
  };

  const createScheduleInput = {
    Name: `DRKunta-${process.env.STAGE_NAME}-${event.municipality}`,
    GroupName: `DRKunta-${process.env.STAGE_NAME}`,
    ScheduleExpression: 'cron(0 10 ? * TUE *)',
    Target: {
      Arn: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityData`,
      RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/service-role/DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityDataScheduleRole`,
      Input: `{
        "municipality": "${event.municipality}",
        "url": "${event.url}",
        }`
    },
    FlexibleTimeWindow: {
      Mode: 'off'
    }
  };

  const putParameterCommand = new PutParameterCommand(putParameterInput);
  const creteScheduleCommand = new CreateScheduleCommand(createScheduleInput);

  await ssm.send(putParameterCommand);
  await scheduler.send(creteScheduleCommand);
  return {
    statusCode: 201
  };
};

export const main = middyfy(createSchedule);
