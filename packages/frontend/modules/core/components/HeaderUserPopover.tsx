import styled from "@emotion/styled";
import { PrimaryPopover } from "modules/popover/components/PrimaryPopover";
import { usePopoverContext } from "modules/popover/hooks/usePopoverContext";
import { useStores } from "modules/state/manager";
import { SVGIcon } from "modules/ui/components/SVGIcon";
import Link from "next/link";

const Container = styled(PrimaryPopover)`
  margin: 16px 0px;
  padding: 8px 0px;
`;

const Option = styled.a`
  display: flex;

  min-width: 180px;

  padding: 12px 24px;
  cursor: pointer;

  color: ${(props) => props.theme.fontColor.muted};
`;

const Label = styled.span`
  margin-left: 16px;
`;

const Icon = styled(SVGIcon)`
  width: 24px;
  height: 24px;
`;

export function HeaderUserPopover() {
  const { authStore } = useStores();
  const popover = usePopoverContext();

  const handleLogout = async () => {
    await authStore.logout();
    popover.dismiss();
  };

  return (
    <Container>
      <Link href="/profile" passHref>
        <Option onClick={popover.dismiss}>
          <Icon name="user" />
          <Label>Profil</Label>
        </Option>
      </Link>
      <Option onClick={handleLogout}>
        <Icon name="logout" />
        <Label>Logg ut</Label>
      </Option>
    </Container>
  );
}
