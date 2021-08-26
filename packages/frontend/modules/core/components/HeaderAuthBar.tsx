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
  const { authStore, modalStore } = useStores();
  const isAuthenticated = useObserver(() => authStore.isAuthenticated);

  const renderModalContent = () => {
    return <>Login modal goes here</>;
  };

  const renderUnauthenticated = () => {
    return (
      <GenericButton
        onClick={() => {
          console.log("test");
          modalStore.spawn({
            key: "test",
            render: renderModalContent,
          });
        }}
        label="Logg inn"
      />
    );
  };

  const renderAuthenticated = () => {
    return null;
  };

  return <Container>{isAuthenticated ? renderAuthenticated() : renderUnauthenticated()}</Container>;
}
