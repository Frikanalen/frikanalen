import styled from "@emotion/styled";
import Link from "next/link";
import { humanizeScheduleItemDate } from "../helpers/humanizeScheduleItemDate";
import { ScheduleItem } from "../types";

const Container = styled.div`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 8px;
    border-top: solid 2px ${(props) => props.theme.color.divider};
    padding-top: 8px;
  }
`;

const PrimaryInfo = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  width: 0;
`;

const Title = styled.a`
  font-size: 1.1em;
  font-weight: 700;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Organization = styled.a`
  font-size: 1.1em;
  font-weight: 400;
`;

const Time = styled.span`
  font-size: 1em;
  font-weight: 600;
  color: ${(props) => props.theme.fontColor.muted};

  margin-left: 24px;
`;

export type ScheduleItemSummary = {
  item: ScheduleItem;
};

export function ScheduleItemSummary(props: ScheduleItemSummary) {
  const { item } = props;

  return (
    <Container>
      <PrimaryInfo>
        <Link href={`/video/${item.video.id}`} passHref>
          <Title>{item.video.name}</Title>
        </Link>
        <Link href={`/organization/${item.video.organization.id}`} passHref>
          <Organization>{item.video.organization.name}</Organization>
        </Link>
      </PrimaryInfo>
      <Time>{humanizeScheduleItemDate(new Date(item.starttime))}</Time>
    </Container>
  );
}
