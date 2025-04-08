import { ScheduleitemRead } from "@/generated/frikanalenDjangoAPI.schemas";

export const CurrentItem = ({ item }: { item: ScheduleitemRead }) => (
  <div className={"flex gap-2 grow font-bold"}>
    <div className={"basis-11 shrink-0 text-left text-lg"}>Nå</div>
    <div>
      <h3 className={"text-lg"}>{item.video.name}</h3>
      <h4>av {item.video.organization.name}</h4>
    </div>
  </div>
);
