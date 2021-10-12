import styled from "@emotion/styled";
import { EmptyState } from "modules/ui/components/EmptyState";
import { Video } from "../resources/Video";
import { VideoGridItem } from "./VideoGridItem";

const Container = styled.div``;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 16px;
`;

export type VideoGridProps = {
  videos: Video[];
};

export function VideoGrid(props: VideoGridProps) {
  const { videos } = props;

  const renderEmptyState = () => {
    if (videos.length > 0) return null;

    return <EmptyState title="Ingen videoer enda" icon="film" />;
  };

  return (
    <Container>
      {renderEmptyState()}
      <Grid>
        {videos.map((v) => (
          <VideoGridItem key={v.data.id} video={v} />
        ))}
      </Grid>
    </Container>
  );
}
