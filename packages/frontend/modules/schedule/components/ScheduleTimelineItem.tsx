import styled from "@emotion/styled";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { ScheduleItem } from "../types";

const Container = styled.div`
  display: flex;
  align-items: flex-start;

  margin-bottom: 32px;
`;

const Time = styled.span`
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.fontColor.subdued};

  margin-top: 1px;
`;

const PrimaryInfo = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  width: 0;

  margin-left: 16px;
`;

const Title = styled.div`
  display: inline;

  font-size: 1.1em;
  font-weight: 700;
`;

const Organization = styled.div`
  font-size: 1.1em;
  font-weight: 400;
`;

export type ScheduleTimelineItemProps = {
  item: ScheduleItem;
};

export function ScheduleTimelineItem(props: ScheduleTimelineItemProps) {
  const { item } = props;

  return (
    <Container>
      <Time>{format(new Date(item.starttime), "HH:mm")}</Time>
      <PrimaryInfo>
        <Title>
          <Link href={`/video/${item.video.id}`} passHref>
            <a>{item.video.name}</a>
          </Link>
        </Title>
        <Organization>
          <Link href={`/organization/${item.video.organization.id}`} passHref>
            <a>{item.video.organization.name}</a>
          </Link>
        </Organization>
      </PrimaryInfo>
    </Container>
  );
}
