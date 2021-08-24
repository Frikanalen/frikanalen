import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { VideoPlayer } from "modules/video/components/VideoPlayer";
import { GetServerSideProps, NextPageContext } from "next";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  width: 50%;
`;

const Sidebar = styled.div`
  flex: 1;
  margin-left: 32px;
`;

export default function Index() {
  const { scheduleStore } = useStores();

  return (
    <Container>
      <Main>
        <VideoPlayer width={1280} height={720} src="https://frikanalen.no/stream/index.m3u8" />
      </Main>
      <Sidebar>
        <h2>Velkommen til nye Frikanalen!</h2>
        <p>Etter mye hardt arbeide bak scenene kan vi endelig presentere første versjon av nye frikanalen.no!</p>
        <p>Snart vil det komme en nyhetsseksjon så dere vil kunne få et innblikk i alt arbeidet som er gjort.</p>
        <p>
          I mellomtiden vil du kunne få et lite innblikk i endringene ved å se på{" "}
          <a href="https://github.com/Frikanalen/frikanalen/commits/master">endringsloggen i kodearkivet</a>.
        </p>
        {JSON.stringify(scheduleStore.items)}
      </Sidebar>
    </Container>
  );
}

Index.getInitialProps = async (context: NextPageContext) => {
  const { scheduleStore } = context.manager.stores;
  await scheduleStore.fetch();

  return {};
};
