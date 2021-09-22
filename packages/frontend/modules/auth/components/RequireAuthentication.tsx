import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { SVGIcon } from "modules/ui/components/SVGIcon";
import { useEffect } from "react";
import { spawnLoginModal } from "../helpers/spawnLoginModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
`;

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  font-size: 1.1em;
  font-weight: 500;

  margin-bottom: 32px;
`;

const Icon = styled(SVGIcon)`
  color: ${(props) => props.theme.fontColor.subdued};
  width: 64px;
  height: 64px;

  margin-bottom: 32px;
`;

export function RequireAuthentication(props: { children: JSX.Element }) {
  const { children } = props;
  const manager = useManager();

  const { authStore } = manager.stores;
  const isAuthenticated = useObserver(() => authStore.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      spawnLoginModal(manager);
    }
  }, [isAuthenticated, manager]);

  if (isAuthenticated) return children;

  return (
    <Container>
      <Icon name="lock" />
      <Title>Hvem der?</Title>
      <Subtitle>Du må være logget inn for å kunne bruke denne siden.</Subtitle>
      <GenericButton onClick={() => spawnLoginModal(manager)} label="Logg inn" />
    </Container>
  );
}
