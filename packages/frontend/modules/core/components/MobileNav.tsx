import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { PrimaryPopover } from "modules/popover/components/PrimaryPopover";
import { usePopover } from "modules/popover/hooks/usePopover";
import { usePopoverContext } from "modules/popover/hooks/usePopoverContext";
import { Button, ButtonWithProps } from "modules/ui/components/Button";
import { SVGIcon } from "modules/ui/components/SVGIcon";
import { Router } from "next/router";
import { useEffect, useRef } from "react";
import { MOBILE_MENU_THRESHOLD } from "../constants";
import { NavLinks } from "./NavLinks";

const Container = styled.div`
  display: none;

  @media (max-width: ${MOBILE_MENU_THRESHOLD}px) {
    display: block;
  }
`;

const Menu = styled(Button as ButtonWithProps<{ active: boolean }>)`
  padding: 8px;

  border: solid 2px ${(props) => props.theme.color.divider};
  border-radius: 4px;

  color: ${(props) => props.theme.fontColor.muted};
  transition: 200ms ease all;

  ${(props) => {
    if (props.active) {
      return css`
        border-color: ${props.theme.color.accent};
      `;
    }
  }}
`;

const Hamburger = styled(SVGIcon)`
  width: 24px;
  height: 24px;
`;

const PopoverContainer = styled(PrimaryPopover)`
  margin: 16px 0px;
  padding: 16px 0px;

  display: flex;
  flex-direction: column;
`;

export function Popover() {
  const popover = usePopoverContext();

  useEffect(() => {
    const handleChange = async () => {
      popover.dismiss();
    };

    Router.events.on("routeChangeComplete", handleChange);
    return () => Router.events.off("routeChangeComplete", handleChange);
  });

  return (
    <PopoverContainer>
      <NavLinks />
    </PopoverContainer>
  );
}

export function MobileNav() {
  const ref = useRef<HTMLButtonElement>(null);

  const { toggle, active } = usePopover({
    ref,
    render: () => <Popover />,
    placement: "bottom-start",
  });

  return (
    <Container>
      <Menu active={active} onClick={toggle} ref={ref}>
        <Hamburger name="menu" />
      </Menu>
    </Container>
  );
}
