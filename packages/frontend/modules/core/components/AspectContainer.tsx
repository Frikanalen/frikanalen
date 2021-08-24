import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Container = styled.div<{ width: number; height: number }>`
  position: relative;
  padding-top: ${(props) => (props.height / props.width) * 100}%;
`;

const Inner = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;

export type AspectContainerProps = PropsWithChildren<{
  width: number;
  height: number;
}>;

export function AspectContainer(props: AspectContainerProps) {
  const { children, width, height } = props;

  return (
    <Container width={width} height={height}>
      <Inner>{children}</Inner>
    </Container>
  );
}
