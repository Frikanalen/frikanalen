import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { spawnLoginModal } from "modules/auth/helpers/spawnLoginModal";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import Link from "next/link";
import React from "react";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const UserLink = styled.a`
  font-size: 1.2em;
  font-weight: 600;
`;

export function HeaderAuthBar() {
  const manager = useManager();
  const { authStore } = manager.stores;

  const isAuthenticated = useObserver(() => authStore.isAuthenticated);

  const renderUnauthenticated = () => {
    return <GenericButton onClick={() => spawnLoginModal(manager)} label="Logg inn" />;
  };

  const renderAuthenticated = () => {
    const user = authStore.user!;

    return (
      <Link href="/profil" passHref>
        <UserLink>Hei, {user.firstName}</UserLink>
      </Link>
    );
  };

  return <Container>{isAuthenticated ? renderAuthenticated() : renderUnauthenticated()}</Container>;
}
