import { middyfy } from '@libs/lambda';
import { SSM, PutParameterCommand } from '@aws-sdk/client-ssm';
import {
  SchedulerClient,
  CreateScheduleCommand
} from '@aws-sdk/client-scheduler';

const createSchedule = async (event) => {
  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

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
      RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/DRKunta-${process.env.STAGE_NAME}-fetchMunicipalityDataScheduleRole`,
      Input: `{
        "municipality": "${event.municipality}",
        "url": "${event.url}",
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
    await scheduler.send(creteScheduleCommand);
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      message: 'Schedule already exists'
    };
  }
  return {
    statusCode: 201
  };
};

export const main = middyfy(createSchedule);
