import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { CalendarInput } from "modules/input/components/CalendarInput";
import { humanizeSelectedScheduleDate } from "modules/schedule/helpers/humanizeSelectedScheduleDate";
import { useStores } from "modules/state/manager";

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 350px;

  border-right: solid 2px ${(props) => props.theme.color.divider};
  padding-right: 24px;
  margin-right: 24px;
`;

const Result = styled.div`
  flex: 1;
`;

const DayTitle = styled.h2``;

export default function Schedule() {
  const { scheduleStore } = useStores();

  const selectedDate = useObserver(() => scheduleStore.selectedDate);
  const handleSelect = (date: Date) => {
    scheduleStore.selectedDate = date;
  };

  return (
    <Container>
      <Sidebar>
        <CalendarInput value={selectedDate} onChange={handleSelect} />
      </Sidebar>
      <Result>
        <DayTitle>{humanizeSelectedScheduleDate(selectedDate)}</DayTitle>
      </Result>
    </Container>
  );
}
