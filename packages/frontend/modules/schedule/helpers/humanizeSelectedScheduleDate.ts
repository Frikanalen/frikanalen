import { differenceInWeeks, format, isToday, isTomorrow, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

export const humanizeSelectedScheduleDate = (date: Date) => {
  const now = new Date();

  if (isToday(date)) return "i dag";
  if (isTomorrow(date)) return "i morgen";
  if (isYesterday(date)) return "i går";

  if (differenceInWeeks(date, now) < 1) {
    return format(date, "EEEE", { locale: nb });
  }

  return format(date, "d MMMM", { locale: nb });
};
