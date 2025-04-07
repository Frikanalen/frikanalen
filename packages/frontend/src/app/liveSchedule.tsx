import { add, format, isBefore, sub } from "date-fns";
import { useMemo } from "react";
import { useScheduleitemsList } from "@/generated/scheduleitems/scheduleitems";
import { ScheduleitemRead } from "@/generated/frikanalenDjangoAPI.schemas";

const ScheduleItem = ({ item }: { item: ScheduleitemRead }) => (
  <div>
    <div className={"flex gap-2"}>
      <div className={"basis-10 text-left"}>
        {format(new Date(item.starttime), "HH:mm")}
      </div>
      <div>
        {item.video.name}
        <br />
        <div>{item.video.organization.name}</div>
      </div>
    </div>
  </div>
);
export const LiveSchedule = () => {
  const today = useMemo(() => sub(new Date(), { hours: 1 }), []);
  const { data } = useScheduleitemsList({
    starttime_Gt: today.toISOString(),
    starttime_Lt: add(today, { days: 1 }).toISOString(),
    ordering: "starttime",
  });

  if (!data?.results) return null;
  const currentProgram = data.results.findIndex(({ endtime }) =>
    isBefore(new Date(), new Date(endtime)),
  );

  if (currentProgram == -1)
    return (
      <pre>
        {currentProgram}
        <br />
        {new Date().toISOString()}
        <br />
        {JSON.stringify(data, null, 2)}
      </pre>
    );

  return (
    <div>
      <ScheduleItem item={data.results[currentProgram]} />
      <ScheduleItem item={data.results[currentProgram + 1]} />
    </div>
  );
};
