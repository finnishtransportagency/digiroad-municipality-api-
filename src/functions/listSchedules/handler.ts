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
    const schedules = response.Schedules.map((schedule) => {
      return {
        Name: schedule.Name,
        Created: schedule.CreationDate
      };
    });
    return {
      statusCode: 200,
      body: JSON.stringify(schedules)
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
