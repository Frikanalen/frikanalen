import styled from "@emotion/styled";
import { AspectContainer } from "modules/core/components/AspectContainer";
import dynamic from "next/dynamic";

// No types for this library
// @ts-ignore
const ShakaPlayer = dynamic(() => import("shaka-player-react"), { ssr: false }) as any;

const Container = styled.div`
  position: relative;

  > div {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  border-radius: 4px;
  overflow: hidden;

  height: 100%;
  width: 100%;

  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
`;

export type LiveVideoPlayerProp = {
  src: string;
  width: number;
  height: number;
};

export function LiveVideoPlayer(props: LiveVideoPlayerProp) {
  const { src, width, height } = props;

  return (
    <AspectContainer width={width} height={height}>
      <Container>
        <ShakaPlayer src={src} />
      </Container>
    </AspectContainer>
  );
}
