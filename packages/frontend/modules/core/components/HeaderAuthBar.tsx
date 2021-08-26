import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { useStores } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import React from "react";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

export function HeaderAuthBar() {
  const { authStore } = useStores();
  const isAuthenticated = useObserver(() => authStore.isAuthenticated);

  const renderUnauthenticated = () => {
    return <GenericButton label="Logg inn" />;
  };

  const renderAuthenticated = () => {
    return null;
  };

  return <Container>{isAuthenticated ? renderAuthenticated() : renderUnauthenticated()}</Container>;
}
