import styled from "@emotion/styled";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { createResourcePageWrapper } from "modules/state/helpers/createResourcePageWrapper";
import { Video } from "modules/video/resources/Video";
import { VideoPlayer } from "modules/video/components/VideoPlayer";
import Link from "next/link";
import React from "react";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
`;

const PrimaryInfo = styled.div`
  margin-top: 16px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 2px;
`;

const Organization = styled.h3`
  font-size: 1.1em;
  font-weight: 400;

  margin-bottom: 12px;
`;

const Description = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

const UploadedDate = styled.span`
  color: ${(props) => props.theme.fontColor.muted};
`;

const Sidebar = styled.div`
  width: 320px;
  margin-left: 32px;
`;

export type ContentProps = {
  video: Video;
};

function VideoView(props: ContentProps) {
  const { video } = props;
  const { name, createdTime, header, organization, ogvUrl, files } = video.data;

  return (
    <Container>
      <Content>
        <VideoPlayer width={1280} height={720} src={ogvUrl} thumbnail={files.largeThumb} />
        <PrimaryInfo>
          <Title>{name}</Title>
          <Organization>
            <Link href={`/organization/${organization.id}`} passHref>
              <a>{organization.name}</a>
            </Link>
          </Organization>
        </PrimaryInfo>
        <Description>{header}</Description>
        <UploadedDate>lastet opp {format(new Date(createdTime), "d. MMM yyyy", { locale: nb })}</UploadedDate>
      </Content>
      <Sidebar></Sidebar>
    </Container>
  );
}

const VideoPage = createResourcePageWrapper<Video>({
  getFetcher: (query, manager) => {
    const { videoStore } = manager.stores;
    const { videoId } = query;

    const safeVideoId = Number(videoId) ?? 0;
    return videoStore.fetchById(safeVideoId);
  },
  renderContent: (v) => <VideoView video={v} />,
});

export default VideoPage;
