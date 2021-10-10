import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { spawnLoginModal } from "modules/auth/helpers/spawnLoginModal";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import React from "react";
import { HeaderUserDropdown } from "./HeaderUserDropdown";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

export function HeaderAuthBar() {
  const manager = useManager();
  const { authStore } = manager.stores;

  const isAuthenticated = useObserver(() => authStore.isAuthenticated);

  const renderUnauthenticated = () => {
    return <GenericButton variant="primary" onClick={() => spawnLoginModal(manager)} label="Logg inn" />;
  };

  const renderAuthenticated = () => {
    const user = authStore.user!;

    return <HeaderUserDropdown user={user} />;
  };

  return <Container>{isAuthenticated ? renderAuthenticated() : renderUnauthenticated()}</Container>;
}
