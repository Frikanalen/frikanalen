import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { Meta } from "modules/core/components/Meta";
import { ScheduleItemBlurb } from "modules/schedule/components/ScheduleItemBlurb";
import { ScheduleItemSummary } from "modules/schedule/components/ScheduleItemSummary";
import { useStores } from "modules/state/manager";
import { LiveVideoPlayer } from "modules/video/components/LiveVideoPlayer";
import { NextPageContext } from "next";
import React from "react";

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
  margin-top: 32px;
  font-size: 1.5em;
`;

const Schedule = styled.div`
  margin-top: 16px;
`;

export default function Index() {
  const { scheduleStore } = useStores();

  const [now, ...later] = useObserver(() => scheduleStore.upcoming);

  const renderSchedule = () => {
    if (!now) return null;

    return (
      <>
        <NowPlaying item={now} />
        <NextTitle>Senere</NextTitle>
        <Schedule>
          {later.map((x) => (
            <ScheduleItemSummary key={x.data.id} item={x} />
          ))}
        </Schedule>
      </>
    );
  };

  return (
    <Container>
      <Meta
        meta={{
          title: "Direkte",
          description: "Frikanalen er sivilsamfunnets videoplatform",
          type: "website",
        }}
      />
      <Main>
        <LiveVideoPlayer width={1280} height={720} src="https://frikanalen.no/stream/index.m3u8" />
        {renderSchedule()}
      </Main>
      <Sidebar>
        <h1>Velkommen til nye Frikanalen!</h1>
        <p>Etter mye hardt arbeid bak scenene kan vi endelig presentere første versjon av nye frikanalen.no!</p>
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
