import { ScheduleitemRead } from "@/generated/frikanalenDjangoAPI.schemas";
import { isWithinInterval } from "date-fns";

const scheduleItemInterval = ({
  endtime: end,
  starttime: start,
}: ScheduleitemRead) => ({ start, end });

export const useScheduleCursor = (
  now: Date,
  schedule: ScheduleitemRead[] | undefined,
) => {
  if (!schedule) return { currentProgram: null, nextProgram: null };

  const currentProgramIndex =
    schedule.findIndex((item) =>
      isWithinInterval(now, scheduleItemInterval(item)),
    ) ?? -1;

  if (currentProgramIndex === -1)
    return { currentProgram: null, nextProgram: null };

  const currentProgram = schedule[currentProgramIndex];
  const nextProgram = schedule[currentProgramIndex + 1] || null;

  return { currentProgram, nextProgram };
};
