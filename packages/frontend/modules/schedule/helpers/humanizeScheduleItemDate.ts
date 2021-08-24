import { differenceInMinutes, differenceInSeconds, format, isToday } from "date-fns";
import { nb } from "date-fns/locale";

export const humanizeScheduleItemDate = (date: Date) => {
  const now = new Date();
  const secondDifference = differenceInSeconds(date, now);

  if (secondDifference <= 0) {
    return "nå";
  }

  if (secondDifference < 60) {
    return `${secondDifference} sek`;
  }

  if (differenceInMinutes(date, now) < 60) {
    return `${Math.round(secondDifference / 60)} min`;
  }

  if (isToday(date)) {
    return format(date, "HH:mm", { locale: nb });
  }

  return format(date, "HH:mm - d. MMM", { locale: nb });
};
