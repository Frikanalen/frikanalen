import styled from "@emotion/styled";
import { Resource } from "modules/state/classes/Resource";
import { VideoPlayer } from "modules/video/components/VideoPlayer";
import { Video } from "modules/video/types";
import { NextPageContext } from "next";

const Container = styled.div``;

export type VideoPageProps = {
  video: Resource<Video>;
};

export default function VideoPage(props: VideoPageProps) {
  console.log(props);

  const { video } = props;
  const { ogvUrl, files } = video.data;

  return (
    <Container>
      <VideoPlayer width={1280} height={720} src={ogvUrl} thumbnail={files.largeThumb} />
    </Container>
  );
}

VideoPage.getInitialProps = async (context: NextPageContext) => {
  const { manager, query } = context;
  const { videoStore } = manager.stores;
  const { videoId } = query;

  const safeVideoId = Number(videoId) ?? 0;
  const { resource, promise } = videoStore.fetchById(safeVideoId);

  await promise;

  return { video: resource };
};
