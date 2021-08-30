import styled from "@emotion/styled";
import { IconType } from "../types";
import { Button, ButtonProps } from "./Button";
import { SVGIcon } from "./SVGIcon";

const Container = styled(Button)``;

const Icon = styled(SVGIcon)`
  width: 16px;
  height: 16px;
`;

export type IconButtonProps = ButtonProps & {
  icon: IconType;
};

export function IconButton(props: IconButtonProps) {
  const { className, icon, ...rest } = props;

  return (
    <Container {...rest}>
      <Icon className={className} name={icon} />
    </Container>
  );
}
