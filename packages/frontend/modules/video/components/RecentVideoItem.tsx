import styled from "@emotion/styled";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { AspectContainer } from "modules/core/components/AspectContainer";
import { Video } from "modules/video/resources/Video";
import Link from "next/link";
import React from "react";

const Container = styled.div`
  display: flex;

  & + & {
    margin-top: 32px;
  }
`;

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

const Content = styled.div`
  width: 60%;
  margin-left: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: 1em;
  font-weight: 600;
`;

const UploadedDate = styled.span`
  font-size: 1em;
  color: ${(props) => props.theme.fontColor.muted};
`;

export type RecentVideoItemProps = {
  video: Video;
};

export function RecentVideoItem(props: RecentVideoItemProps) {
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
      <Content>
        <Title>
          <Link href={`/video/${id}`} passHref>
            <a>{name}</a>
          </Link>
        </Title>
        <UploadedDate>lastet opp {format(new Date(createdTime), "d. MMM yyyy", { locale: nb })}</UploadedDate>
      </Content>
    </Container>
  );
}
