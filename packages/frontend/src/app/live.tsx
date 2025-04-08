"use client";
import dynamic from "next/dynamic";
import { Card, CardBody } from "@heroui/react";
import { useLivePageScheduleItems } from "@/app/useLivePageScheduleItems";
import { use20PPM, use4PPH } from "@/app/use20PPM";
import { useScheduleCursor } from "@/app/useScheduleCursor";
import { CurrentItem } from "@/app/currentItem";
import { VideoBlurb } from "@/app/videoBlurb";

const VideoPlayer = dynamic(() => import("@/components/stream/VideoPlayer"), {
  ssr: false,
});
import { ScheduleitemRead } from "@/generated/frikanalenDjangoAPI.schemas";
import { format } from "date-fns";

export const NextItem = ({ item }: { item: ScheduleitemRead }) => (
  <div className={"flex gap-2 grow"}>
    <div className={"basis-11 shrink-0 text-left"}>
      {format(new Date(item.starttime), "HH:mm")}
    </div>
    <div>
      <h3>{item.video.name}</h3>
      <h4>av {item.video.organization.name}</h4>
    </div>
  </div>
);

export const Live = () => {
  const { data: schedule } = useLivePageScheduleItems(use4PPH());
  const { currentProgram, nextProgram } = useScheduleCursor(
    use20PPM(),
    schedule?.results,
  );
  if (!currentProgram) return null;
  return (
    <div className="flex flex-col gap-4">
      <Card className={"bg-white/90 dark:bg-green-950"}>
        <CardBody className={"space-y-1"}>
          <CurrentItem item={currentProgram} />
          <NextItem item={nextProgram} />
        </CardBody>
      </Card>
      <VideoPlayer
        title="Frikanalen direkte"
        src="https://frikanalen.no/stream/index.m3u8"
      />
      <Card className={"bg-white/90 dark:bg-green-950"}>
        <CardBody className={"flex flex-col gap-4"}>
          <VideoBlurb video={currentProgram.video} />
        </CardBody>
      </Card>
    </div>
  );
};
