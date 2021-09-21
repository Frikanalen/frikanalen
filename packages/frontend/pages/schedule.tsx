import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { CalendarInput } from "modules/input/components/CalendarInput";
import { ScheduleTimelineItem } from "modules/schedule/components/ScheduleTimelineItem";
import { humanizeSelectedScheduleDate } from "modules/schedule/helpers/humanizeSelectedScheduleDate";
import { useStores } from "modules/state/manager";
import { NextPageContext } from "next";

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 320px;

  border-left: solid 2px ${(props) => props.theme.color.divider};
  padding-left: 32px;
  margin-left: 32px;
`;

const Result = styled.div`
  flex: 1;
`;

const DayTitle = styled.h2`
  margin-bottom: 16px;
`;

export default function Schedule() {
  const { scheduleStore } = useStores();

  const selectedDate = useObserver(() => scheduleStore.selectedDate);
  const selectedDateItems = useObserver(() => scheduleStore.selectedDateItems);

  const handleSelect = (date: Date) => {
    scheduleStore.selectedDate = date;
    scheduleStore.fetchByDate(date);
  };

  return (
    <Container>
      <Result>
        <DayTitle>{humanizeSelectedScheduleDate(selectedDate)}</DayTitle>
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
