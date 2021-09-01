import styled from "@emotion/styled";
import { AspectContainer } from "modules/core/components/AspectContainer";
import React from "react";

const Container = styled.video`
  width: 100%;
  height: 100%;

  border-radius: 4px;
  overflow: hidden;

  height: 100%;
  width: 100%;

  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
`;

export type VideoPlayerProps = {
  src: string;
  thumbnail: string;
  width: number;
  height: number;
};

export function VideoPlayer(props: VideoPlayerProps) {
  const { src, thumbnail, width, height } = props;

  return (
    <AspectContainer width={width} height={height}>
      <Container controls poster={thumbnail}>
        <source src={src} />
      </Container>
    </AspectContainer>
  );
}
