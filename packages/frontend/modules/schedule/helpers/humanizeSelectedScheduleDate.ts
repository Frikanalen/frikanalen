import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

export const humanizeSelectedScheduleDate = (date: Date) => {
  if (isToday(date)) return "i dag";
  if (isTomorrow(date)) return "i morgen";
  if (isYesterday(date)) return "i går";

  return format(date, "d MMMM", { locale: nb });
};
