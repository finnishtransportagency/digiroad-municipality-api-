import { middyfy } from '@libs/lambda';
import {
  SchedulerClient,
  ListSchedulesCommand
} from '@aws-sdk/client-scheduler';

const listSchedules = async (event) => {
  const scheduler = new SchedulerClient({});

  const listScheduleInput = {
    GroupName: `DRKunta-${process.env.STAGE_NAME}`
  };

  const listScheduleCommand = new ListSchedulesCommand(listScheduleInput);

  try {
    const response = await scheduler.send(listScheduleCommand);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      body: 'Could not find schedules'
    };
  }
};

export const main = middyfy(listSchedules);
