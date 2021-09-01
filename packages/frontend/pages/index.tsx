import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { ScheduleItemBlurb } from "modules/schedule/components/ScheduleItemBlurb";
import { ScheduleItemSummary } from "modules/schedule/components/ScheduleItemSummary";
import { useStores } from "modules/state/manager";
import { LiveVideoPlayer } from "modules/video/components/LiveVideoPlayer";
import { NextPageContext } from "next";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  width: 60%;
`;

const Sidebar = styled.div`
  flex: 1;
  margin-left: 32px;
`;

const NowPlaying = styled(ScheduleItemBlurb)`
  margin-top: 16px;
`;

const NextTitle = styled.h3`
  margin-top: 16px;
`;

const Schedule = styled.div`
  margin-top: 16px;
  margin-bottom: 32px;
`;

export default function Index() {
  const { scheduleStore } = useStores();

  const [now, ...later] = useObserver(() => scheduleStore.upcoming);
  if (!now) return null;

  return (
    <Container>
      <Main>
        <LiveVideoPlayer width={1280} height={720} src="https://frikanalen.no/stream/index.m3u8" />
        <NowPlaying item={now} />
        <NextTitle>Senere</NextTitle>
        <Schedule>
          {later.map((x) => (
            <ScheduleItemSummary key={x.id} item={x} />
          ))}
        </Schedule>
      </Main>
      <Sidebar>
        <h2>Velkommen til nye Frikanalen!</h2>
        <p>Etter mye hardt arbeide bak scenene kan vi endelig presentere første versjon av nye frikanalen.no!</p>
        <p>Snart vil det komme en nyhetsseksjon så dere vil kunne få et innblikk i alt arbeidet som er gjort.</p>
        <p>
          I mellomtiden vil du kunne få et lite innblikk i endringene ved å se på{" "}
          <a href="https://github.com/Frikanalen/frikanalen/commits/master">endringsloggen i kodearkivet</a>.
        </p>
      </Sidebar>
    </Container>
  );
}

Index.getInitialProps = async (context: NextPageContext) => {
  const { scheduleStore } = context.manager.stores;
  await scheduleStore.fetchLatest();

  return {};
};
