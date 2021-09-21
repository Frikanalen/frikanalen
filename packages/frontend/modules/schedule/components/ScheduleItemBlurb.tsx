import styled from "@emotion/styled";
import Link from "next/link";
import { ScheduleItem } from "../resources/ScheduleItem";

const Container = styled.div``;

const Title = styled.h2`
  font-size: 1.5em;
  margin-bottom: 2px;
`;

const Organization = styled.h3`
  font-size: 1.1em;
  font-weight: 400;

  margin-bottom: 12px;
`;

const Description = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

export type ScheduleItemBlurbProps = {
  item: ScheduleItem;
  className?: string;
};

export function ScheduleItemBlurb(props: ScheduleItemBlurbProps) {
  const { className, item } = props;

  return (
    <Container className={className}>
      <Title>
        <Link href={`/video/${item.video.data.id}`} passHref>
          <a>{item.video.data.name}</a>
        </Link>
      </Title>
      <Organization>
        <Link href={`/organization/${item.video.organization.data.id}`} passHref>
          <a>{item.video.organization.data.name}</a>
        </Link>
      </Organization>
      <Description>{item.video.data.header}</Description>
    </Container>
  );
}
