import styled from "@emotion/styled";
import { createResourcePageWrapper } from "modules/state/helpers/createResourcePageWrapper";
import { Video } from "modules/video/classes/Video";
import { VideoPlayer } from "modules/video/components/VideoPlayer";

const Container = styled.div``;

export type ContentProps = {
  video: Video;
};

function Content(props: ContentProps) {
  const { video } = props;
  const { ogvUrl, files } = video.data;

  return (
    <Container>
      <VideoPlayer width={1280} height={720} src={ogvUrl} thumbnail={files.largeThumb} />
    </Container>
  );
}

const VideoPage = createResourcePageWrapper({
  getFetcher: (query, manager) => {
    const { videoStore } = manager.stores;
    const { videoId } = query;

    const safeVideoId = Number(videoId) ?? 0;
    return videoStore.fetchById(safeVideoId);
  },
  renderContent: (v) => <Content video={v} />,
});

export default VideoPage;
