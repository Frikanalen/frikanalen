import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { Meta } from "modules/core/components/Meta";
import { CalendarInput } from "modules/input/components/CalendarInput";
import { ScheduleTimelineItem } from "modules/schedule/components/ScheduleTimelineItem";
import { humanizeSelectedScheduleDate } from "modules/schedule/helpers/humanizeSelectedScheduleDate";
import { useStores } from "modules/state/manager";
import { Spinner } from "modules/ui/components/Spinner";
import { NextPageContext } from "next";
import React from "react";

const breakpoint = 700;

const Container = styled.div`
  display: flex;

  @media (max-width: ${breakpoint}px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 320px;

  border-left: solid 2px ${(props) => props.theme.color.divider};
  padding-left: 32px;
  margin-left: 32px;

  @media (max-width: ${breakpoint}px) {
    border-left: none;
    padding-left: 0px;
    margin-left: 0px;

    width: 100%;
    order: -1;

    margin-bottom: 32px;
  }
`;

const Result = styled.div`
  flex: 1;
`;

const DayTitle = styled.h1`
  margin-bottom: 16px;
`;

const SpinnerContainer = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;

  height: calc(100vh - 400px);
`;

export default function Schedule() {
  const { scheduleStore } = useStores();

  const selectedDate = useObserver(() => scheduleStore.selectedDate);
  const selectedDateItems = useObserver(() => scheduleStore.selectedDateItems);

  const handleSelect = (date: Date) => {
    scheduleStore.selectedDate = date;
    scheduleStore.fetchByDate(date);
  };

  const renderSpinner = () => {
    if (selectedDateItems.length > 0) return null;

    return (
      <SpinnerContainer>
        <Spinner size="normal" />
      </SpinnerContainer>
    );
  };

  return (
    <Container>
      <Meta
        meta={{
          title: "Sendeplan",
          description: "Oversikt over programmer som blir sendt i dag",
        }}
      />
      <Result>
        <DayTitle>{humanizeSelectedScheduleDate(selectedDate)}</DayTitle>
        {renderSpinner()}
        {selectedDateItems.map((i) => (
          <ScheduleTimelineItem key={i.data.id} item={i} />
        ))}
      </Result>
      <Sidebar>
        <CalendarInput value={selectedDate} onChange={handleSelect} />
      </Sidebar>
    </Container>
  );
}

Schedule.getInitialProps = async (context: NextPageContext) => {
  const { scheduleStore } = context.manager.stores;
  await scheduleStore.fetchByDate(scheduleStore.selectedDate);

  return {};
};
