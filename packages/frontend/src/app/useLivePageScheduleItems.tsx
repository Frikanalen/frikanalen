import { ScheduleitemsListParams } from "@/generated/frikanalenDjangoAPI.schemas";
import { add, roundToNearestHours, sub } from "date-fns";
import { useScheduleitemsList } from "@/generated/scheduleitems/scheduleitems";

/**
 * Gets the schedule data necessary to render the front page "now and next" display.
 *
 * Note that it is important that now is not hooked right to "new Date()", as it will re-query and
 * re-render the component every time the value of "now" changes. Use support functions like
 * [use20PPM] to get a stable value.
 *
 * @param now
 */
export const useLivePageScheduleItems = (now: Date) => {
  // We round it slightly to make caching a little easier
  const livePageScheduleItems: ScheduleitemsListParams = {
    starttimeAfter: roundToNearestHours(sub(now, { hours: 5 })).toISOString(),
    starttimeBefore: roundToNearestHours(add(now, { hours: 8 })).toISOString(),
    ordering: "starttime",
  };

  return useScheduleitemsList(livePageScheduleItems);
};
