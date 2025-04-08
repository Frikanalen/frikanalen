"use client";
import { Video } from "@/generated/frikanalenDjangoAPI.schemas";
import VideoPlayer from "@/components/stream/VideoPlayer";
import Markdown from "markdown-to-jsx";
import { Card, CardBody, CardHeader } from "@heroui/react";

export const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className="space-y-4">
      <h1 className={"font-bold text-2xl pb-4"}>{video.name}</h1>
      <VideoPlayer
        title={video.name}
        src={video.ogvUrl}
        poster={video.largeThumbnailUrl}
      />
      <Card>
        <CardHeader>
          <div>
            <h3 className={"text-lg font-bold"}>{video.organization.name}</h3>

            <Markdown>
              {video.organization.description?.length
                ? video.organization.description
                : "*organisasjonen har ingen beskrivelse*"}
            </Markdown>
          </div>
        </CardHeader>
        <CardBody>
          <div className={"prose"}>
            <h4>Om videoen</h4>
            <Markdown>
              {video.description ?? "*videoen har ingen beskrivelse*"}
            </Markdown>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
