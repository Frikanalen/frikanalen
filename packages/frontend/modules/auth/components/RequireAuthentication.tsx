import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { Meta } from "modules/core/components/Meta";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { SVGIcon } from "modules/ui/components/SVGIcon";
import { NextPageContext } from "next";
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

export const RequireAuthentication = observer((props: { children: JSX.Element }) => {
  const { children } = props;
  const manager = useManager();

  const { authStore } = manager.stores;
  const { isAuthenticated } = authStore;

  useEffect(() => {
    if (!isAuthenticated) {
      spawnLoginModal(manager);
    }
  }, [isAuthenticated, manager]);

  if (isAuthenticated) return children;

  return (
    <Container>
      <Meta
        meta={{
          title: "Logg inn",
          description: "Denne siden krever innlogging",
        }}
      />
      <Icon name="lock" />
      <Title>Hvem der?</Title>
      <Subtitle>Du må være logget inn for å kunne bruke denne siden.</Subtitle>
      <GenericButton variant="primary" onClick={() => spawnLoginModal(manager)} label="Logg inn" />
    </Container>
  );
});

export const getInitialRequireAuthenticationProps = async (context: NextPageContext) => {
  const { res, manager } = context;
  const { authStore } = manager.stores;

  if (authStore.isAuthenticated || !res) {
    return {};
  }

  res.statusCode = 401;
  return { statusCode: 401 };
};
