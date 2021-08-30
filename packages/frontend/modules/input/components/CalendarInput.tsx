import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { isSameDay, isToday } from "date-fns";
import { AspectContainer } from "modules/core/components/AspectContainer";
import { IconButton } from "modules/ui/components/IconButton";
import { useState } from "react";

const Container = styled.div``;

const Header = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.span`
  flex: 1;
  text-align: center;

  font-size: 1.2em;
  font-weight: 600;
`;

const NavigationButton = styled(IconButton)`
  width: 24px;
  height: 24px;
`;

const DayRow = styled.div`
  display: flex;
  margin-top: 24px;
`;

const Day = styled.span`
  display: inline-block;
  width: ${(1 / 7) * 100}%;

  color: ${(props) => props.theme.fontColor.muted};

  font-weight: 600;
  font-size: 0.8em;

  text-align: center;
  text-transform: uppercase;
`;

const DateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const DateNumberContainer = styled.div`
  width: ${(1 / 7) * 100}%;
  padding: 2px;
`;

type DateNumberType = "previous" | "normal" | "today" | "selected";

const DateNumber = styled.a<{ type: DateNumberType }>`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.9em;
  font-weight: 600;

  border: solid 2px transparent;
  border-radius: 100%;

  transition: 200ms ease all;
  cursor: pointer;

  color: ${(props) => props.theme.fontColor.normal};

  ${(props) => {
    const { type } = props;

    if (type === "selected") {
      return css`
        border-color: ${props.theme.color.accent};
      `;
    }

    if (type === "today") {
      return css`
        border-color: ${props.theme.color.thirdAccent};
      `;
    }

    if (type === "previous")
      return css`
        color: ${props.theme.fontColor.subdued};
      `;

    return css`
      &:hover {
        border-color: ${props.theme.color.divider};
      }
    `;
  }}
`;

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const dayNames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

export type CalendarInputProps = {
  value?: Date;
  onChange?: (date: Date) => void;
};

export function CalendarInput(props: CalendarInputProps) {
  const { value = new Date(), onChange = () => {} } = props;

  const [selected, setSelected] = useState(value);

  const [year, setYear] = useState(selected.getFullYear());
  const [month, setMonth] = useState(selected.getMonth());

  const numberOfDays = 40 - new Date(year, month, 40).getDate();
  const firstDayOf = (new Date(year, month).getDay() + 6) % 7;

  const navigate = (amount: number) => {
    let newMonth = month + amount;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  const selectDate = (date: Date) => {
    setSelected(date);
    setYear(date.getFullYear());
    setMonth(date.getMonth());

    onChange(date);
  };

  const renderDate = (day: number) => {
    const offsetDay = day - (firstDayOf - 1);
    const date = new Date(year, month, offsetDay);

    let type: DateNumberType = "normal";

    if (isToday(date)) {
      type = "today";
    }

    if (isSameDay(date, selected)) {
      type = "selected";
    }

    if (offsetDay < 0) {
      type = "previous";
    }

    return (
      <DateNumberContainer key={day}>
        <AspectContainer width={1} height={1}>
          <DateNumber onClick={() => selectDate(date)} type={type}>
            {date.getDate()}
          </DateNumber>
        </AspectContainer>
      </DateNumberContainer>
    );
  };

  return (
    <Container>
      <Header>
        <NavigationButton onClick={() => navigate(-1)} title="Forrige" icon="chevronLeft" />
        <HeaderTitle>
          {monthNames[month].toLowerCase()} {year}
        </HeaderTitle>
        <NavigationButton onClick={() => navigate(1)} title="Neste" icon="chevronRight" />
      </Header>
      <DayRow>
        {dayNames.map((d) => (
          <Day title={d} key={d}>
            {d.slice(0, 3)}
          </Day>
        ))}
      </DayRow>
      <DateGrid>
        {Array(numberOfDays + firstDayOf)
          .fill(undefined)
          .map((_, i) => renderDate(i))}
      </DateGrid>
    </Container>
  );
}
