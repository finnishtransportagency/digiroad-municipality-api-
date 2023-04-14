import { middyfy } from '@libs/lambda';
import {
  SSM,
  GetParameterCommand,
  DeleteParameterCommand
} from '@aws-sdk/client-ssm';
import {
  SchedulerClient,
  GetScheduleCommand,
  DeleteScheduleCommand
} from '@aws-sdk/client-scheduler';

const deleteSchedule = async (event) => {
  const municipality = event.pathParameters.id;

  const scheduler = new SchedulerClient({});
  const ssm = new SSM({});

  const scheduleInput = {
    Name: `DRKunta-${process.env.STAGE_NAME}-${municipality}`
  };
  const parameterInput = {
    Name: `/DRKunta/${process.env.STAGE_NAME}/${municipality}`
  };

  const getScheduleCommand = new GetScheduleCommand(scheduleInput);
  const getParameterCommand = new GetParameterCommand(parameterInput);

  try {
    scheduler.send(getScheduleCommand);
    ssm.send(getParameterCommand);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'No schedule defined for municipality'
    };
  }

  const deleteScheduleCommand = new DeleteScheduleCommand(scheduleInput);
  const deleteParameterCommand = new DeleteParameterCommand(parameterInput);

  scheduler.send(deleteScheduleCommand);
  ssm.send(deleteParameterCommand);

  return {
    statusCode: 200
  };
};

export const main = middyfy(deleteSchedule);
