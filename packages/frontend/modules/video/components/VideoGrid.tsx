import styled from "@emotion/styled";
import { Video } from "../resources/Video";
import { VideoGridItem } from "./VideoGridItem";

const Container = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 16px;
`;

export type VideoGridProps = {
  videos: Video[];
};

export function VideoGrid(props: VideoGridProps) {
  const { videos } = props;

  return (
    <Container>
      {videos.map((v) => (
        <VideoGridItem key={v.data.id} video={v} />
      ))}
    </Container>
  );
}
