import styled from "@emotion/styled";
import { InternalLink } from "modules/ui/components/InternalLink";
import Link from "next/link";
import React from "react";
import { OrganizationRole } from "../schemas";

const Container = styled.li`
  & + & {
    margin-top: 24px;
  }
`;

const Name = styled.h1`
  font-size: 1.1em;
`;

const RoleText = styled.h2`
  font-size: 1em;
  font-weight: 400;
`;

const Options = styled.div`
  margin-top: 8px;
  display: flex;

  > a {
    margin-right: 12px;
  }
`;

export type OrganizationRoleItemProps = {
  role: OrganizationRole;
};

export function OrganizationRoleItem(props: OrganizationRoleItemProps) {
  const { role } = props;

  const roleText = role.role === "editor" ? "Redaktør" : "Medlem";

  return (
    <Container>
      <Name>
        <Link href={`/organization/${role.organizationId}`} passHref>
          <a>{role.organizationName}</a>
        </Link>
      </Name>
      <RoleText>{roleText}</RoleText>
      <Options>
        <InternalLink href={`/organization/${role.organizationId}/upload`}>Last opp video</InternalLink>
      </Options>
    </Container>
  );
}
