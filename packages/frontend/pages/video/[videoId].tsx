import styled from "@emotion/styled";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { createResourcePageWrapper } from "modules/state/helpers/createResourcePageWrapper";
import { Video } from "modules/video/resources/Video";
import { VideoPlayer } from "modules/video/components/VideoPlayer";
import Link from "next/link";
import React from "react";
import { useResourceList } from "modules/state/hooks/useResourceList";
import { useStores } from "modules/state/manager";
import { ListTail } from "modules/state/components/ListTail";
import { RecentVideoItem } from "../../modules/video/components/RecentVideoItem";
import { Meta } from "modules/core/components/Meta";

const breakpoint = 900;

const Container = styled.div`
  display: flex;

  @media (max-width: ${breakpoint}px) {
    flex-direction: column;
  }
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
  font-size: 1em;
  color: ${(props) => props.theme.fontColor.muted};
`;

const Sidebar = styled.div`
  width: 380px;
  margin-left: 32px;

  @media (max-width: ${breakpoint}px) {
    width: 100%;

    margin-left: 0px;
    margin-top: 32px;
  }
`;

const SidebarTitle = styled.h5`
  font-size: 1.2em;
  font-weight: 500;

  margin-bottom: 16px;
`;

export type ContentProps = {
  video: Video;
};

function VideoView(props: ContentProps) {
  const { videoStore } = useStores();
  const { video } = props;
  const { name, createdTime, header, organization, ogvUrl, files } = video.data;

  const videos = useResourceList(video.latestVideosByOrganization, videoStore);

  return (
    <Container>
      <Meta
        meta={{
          title: name,
          description: header,
          author: organization.name,
        }}
      />
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
      <Sidebar>
        <SidebarTitle>Nyeste videoer fra {video.organization.data.name}</SidebarTitle>
        {videos.map((x) => (
          <RecentVideoItem key={x.data.id} video={x} />
        ))}
        <ListTail list={video.latestVideosByOrganization} />
      </Sidebar>
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
  getInitialProps: async (v) => {
    await v.latestVideosByOrganization.more();
  },
});

export default VideoPage;
