"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Video } from "@/generated/frikanalenDjangoAPI.schemas";
import VideoPlayer from "@/components/stream/VideoPlayer";
import Markdown from "markdown-to-jsx";
import { formatDate } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

export const VideoSpotlight = ({ video }: { video: Video }) => {
  return (
    <div>
      <h2 className={"pb-2 font-bold"}>Nyeste video</h2>
      <Card className={""}>
        <CardHeader>
          <div>
            <h2 className="!mt-0 font-bold text-xl">
              <Link href={`/video/${video.id}`}>{video.name}</Link>
            </h2>
            <h3 className="!mt-0">
              Publisert av {video.organization.name}{" "}
              {video.createdTime &&
                formatDate(video.createdTime, "PPPP", { locale: nb })}
            </h3>
          </div>
        </CardHeader>
        <CardBody className={"gap-2"}>
          <VideoPlayer
            title={video.name}
            src={video.ogvUrl}
            poster={video.largeThumbnailUrl}
          />
          <div className={"prose"}>
            <h4>Beskrivelse</h4>
            <Markdown>{video.description ?? ""}</Markdown>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
