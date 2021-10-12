import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { usePopover } from "modules/popover/hooks/usePopover";
import { SVGIcon, SVGIconWithProps } from "modules/ui/components/SVGIcon";
import { User } from "modules/user/schemas";
import { useRef } from "react";
import { HeaderUserPopover } from "./HeaderUserPopover";

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.fontColor.muted};

  cursor: pointer;
  transition: 200ms ease color;

  &:hover {
    color: ${(props) => props.theme.fontColor.normal};
  }
`;

const Name = styled.span`
  font-size: 1.2em;
  font-weight: 600;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  max-width: 300px;

  @media (max-width: 730px) {
    max-width: 170px;
  }
`;

const Icon = styled(SVGIcon as SVGIconWithProps<{ flipped: boolean }>)`
  width: 24px;
  height: 24px;

  margin-left: 8px;
  transition: 200ms ease transform;

  ${(props) =>
    props.flipped
      ? css`
          transform: rotate(180deg);
        `
      : null}
`;

export type HeaderUserDropdownProps = {
  user: User;
};

export function HeaderUserDropdown(props: HeaderUserDropdownProps) {
  const { user } = props;
  const { firstName, email } = useObserver(() => ({ firstName: user.firstName, email: user.email }));

  const ref = useRef<HTMLDivElement>(null);

  const { toggle, active } = usePopover({
    ref,
    render: () => <HeaderUserPopover />,
    placement: "bottom-end",
  });

  return (
    <Container onClick={toggle} ref={ref}>
      <Name>Hei, {firstName || email}!</Name>
      <Icon flipped={active} name="chevronDown" />
    </Container>
  );
}
