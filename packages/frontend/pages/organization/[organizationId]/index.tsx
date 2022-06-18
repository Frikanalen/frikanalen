import styled from "@emotion/styled";
import { Meta } from "modules/core/components/Meta";
import { Organization } from "modules/organization/resources/Organization";
import { ListTail } from "modules/state/components/ListTail";
import { createResourcePageWrapper } from "modules/state/helpers/createResourcePageWrapper";
import { useResourceList } from "modules/state/hooks/useResourceList";
import { useStores } from "modules/state/manager";
import { ExternalLink } from "modules/ui/components/ExternalLink";
import { Section } from "modules/ui/components/Section";
import { VideoGrid } from "modules/video/components/VideoGrid";
import React from "react";

const breakpoint = 1250;

const Container = styled.div``;

const Header = styled.div`
  display: flex;

  @media (max-width: ${breakpoint}px) {
    flex-direction: column;
  }
`;

const PrimaryInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1``;

const Description = styled.div`
  margin-top: 16px;

  white-space: pre-wrap;
  word-break: break-word;
`;

const SecondaryInfo = styled.div`
  white-space: pre-wrap;
  word-break: break-word;

  display: flex;

  @media (max-width: ${breakpoint}px) {
    flex-direction: column;
  }
`;

const InfoSection = styled(Section)`
  margin-left: 32px;
  min-width: 200px;

  @media (max-width: ${breakpoint}px) {
    margin-left: 0px;
    margin-top: 32px;
  }
`;

const InfoSectionLine = styled.span`
  display: block;
  margin-bottom: 8px;
`;

const Content = styled.div`
  margin-top: 16px;
`;

const LatestVideosHeading = styled.h2`
  margin-bottom: 16px;
`;

type OrganizationViewProps = {
  organization: Organization;
};

function OrganizationView(props: OrganizationViewProps) {
  const { videoStore } = useStores();

  const { organization } = props;
  const { name, description, postalAddress, streetAddress, editorName, editorEmail, editorMsisdn } = organization.data;

  const videos = useResourceList(organization.videos, videoStore);

  const renderDescription = () => {
    if (!description) return null;

    return <Description>{description}</Description>;
  };

  return (
    <Container>
      <Meta
        meta={{
          title: name,
          description,
        }}
      />
      <Header>
        <PrimaryInfo>
          <Title>{name}</Title>
          {renderDescription()}
        </PrimaryInfo>
        <SecondaryInfo>
          <InfoSection icon="pencil" title="Redaktør">
            <InfoSectionLine>{editorName}</InfoSectionLine>
            <InfoSectionLine>
              <ExternalLink href={`mailto:${editorEmail}`}>{editorEmail}</ExternalLink>
            </InfoSectionLine>
            <InfoSectionLine>
              <ExternalLink href={`tel:${editorMsisdn}`}>{editorMsisdn}</ExternalLink>
            </InfoSectionLine>
          </InfoSection>
          <InfoSection icon="mail" title="Postadresse">
            {postalAddress.split("\n").map((t) => (
              <InfoSectionLine key={t}>{t}</InfoSectionLine>
            ))}
          </InfoSection>
          <InfoSection icon="home" title="Besøksadresse">
            {streetAddress.split("\n").map((t) => (
              <InfoSectionLine key={t}>{t}</InfoSectionLine>
            ))}
          </InfoSection>
        </SecondaryInfo>
      </Header>
      <Content>
        <LatestVideosHeading>Siste videoer</LatestVideosHeading>
        <VideoGrid videos={videos} />
        <ListTail list={organization.videos} />
      </Content>
    </Container>
  );
}

const OrganizationPage = createResourcePageWrapper<Organization>({
  getFetcher: (query, manager) => {
    const { organizationStore } = manager.stores;
    const { organizationId } = query;

    const safeOrgId = Number(organizationId) ?? 0;
    return organizationStore.fetchById(safeOrgId);
  },
  renderContent: (o) => <OrganizationView organization={o} />,
  getInitialProps: async (o) => {
    await o.videos.more();
  },
});

export default OrganizationPage;
