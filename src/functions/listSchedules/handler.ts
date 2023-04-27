import { middyfy } from '@libs/lambda';
import {
  SchedulerClient,
  ListSchedulesCommand,
  GetScheduleCommand
} from '@aws-sdk/client-scheduler';

const listSchedules = async (event) => {
  const scheduler = new SchedulerClient({});

  const listScheduleInput = {
    GroupName: `DRKunta-${process.env.STAGE_NAME}`
  };

  const listScheduleCommand = new ListSchedulesCommand(listScheduleInput);

  try {
    const listScheduleResponse = await scheduler.send(listScheduleCommand);
    const result = [];
    for (const schedule of listScheduleResponse.Schedules) {
      const getScheduleInput = {
        Name: schedule.Name,
        GroupName: `DRKunta-${process.env.STAGE_NAME}`
      };
      const getScheduleCommand = new GetScheduleCommand(getScheduleInput);
      const getScheduleResponse = await scheduler.send(getScheduleCommand);
      const scheduleObject = {
        name: getScheduleResponse.Name,
        created: getScheduleResponse.CreationDate,
        schedule: getScheduleResponse.ScheduleExpression,
        target: getScheduleResponse.Target
      };
      result.push(scheduleObject);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
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
