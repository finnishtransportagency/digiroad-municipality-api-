import { middyfy } from '@libs/lambda-tools';
import { SSM, GetParameterCommand, DeleteParameterCommand } from '@aws-sdk/client-ssm';
import {
  SchedulerClient,
  GetScheduleCommand,
  DeleteScheduleCommand
} from '@aws-sdk/client-scheduler';
import { stage } from '@functions/config';

const deleteSchedule = async (event) => {
  const municipality = event.pathParameters.municipality;

  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

  const scheduleInput = {
    Name: `DRKunta-${stage}-${municipality}`,
    GroupName: `DRKunta-${stage}`
  };
  const parameterInput = {
    Name: `/DRKunta/${stage}/${municipality}`
  };

  const getScheduleCommand = new GetScheduleCommand(scheduleInput);
  const getParameterCommand = new GetParameterCommand(parameterInput);

  try {
    await scheduler.send(getScheduleCommand);
    await ssm.send(getParameterCommand);
  } catch (e: unknown) {
    console.error(e);
    return {
      statusCode: 400,
      body: 'No schedule defined for municipality'
    };
  }

  const deleteScheduleCommand = new DeleteScheduleCommand(scheduleInput);
  const deleteParameterCommand = new DeleteParameterCommand(parameterInput);

  await scheduler.send(deleteScheduleCommand);
  await ssm.send(deleteParameterCommand);

  return {
    statusCode: 200,
    body: `Successfully deleted schedule for ${municipality}`
  };
};

export const main = middyfy(deleteSchedule);
