import styled from "@emotion/styled";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { AspectContainer } from "modules/core/components/AspectContainer";
import Link from "next/link";
import React from "react";
import { Video } from "../resources/Video";

const Container = styled.li``;

const ThumbnailContainer = styled.div`
  flex: 1;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;

  border-radius: 4px;
  overflow: hidden;

  height: 100%;
  width: 100%;

  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
`;

const PrimaryInfo = styled.div`
  margin-top: 16px;
`;

const Title = styled.h1`
  font-size: 1.2em;
`;

const UploadedDate = styled.span`
  display: block;
  margin-top: 2px;

  font-size: 1em;
  color: ${(props) => props.theme.fontColor.muted};
`;

export type VideoGridItemProps = {
  video: Video;
};

export function VideoGridItem(props: VideoGridItemProps) {
  const { video } = props;
  const { id, files, createdTime, name } = video.data;

  return (
    <Container>
      <ThumbnailContainer>
        <AspectContainer width={1280} height={720}>
          <Link href={`/video/${id}`} passHref>
            <a>
              <Thumbnail src={files.largeThumb} />
            </a>
          </Link>
        </AspectContainer>
      </ThumbnailContainer>
      <PrimaryInfo>
        <Title>
          <Link href={`/video/${id}`} passHref>
            <a>{name}</a>
          </Link>
        </Title>
      </PrimaryInfo>
      <UploadedDate>lastet opp {format(new Date(createdTime), "d. MMM yyyy", { locale: nb })}</UploadedDate>
    </Container>
  );
}
