import React from "react";
import styled from "@emotion/styled";
import { Form } from "modules/form/components/Form";
import { FormField, FormFieldWithProps } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { Organization } from "modules/organization/resources/Organization";
import { createResourcePageWrapper } from "modules/state/helpers/createResourcePageWrapper";
import { useStores } from "modules/state/manager";
import { observer } from "mobx-react-lite";
import { FileInput } from "modules/input/components/FileInput";
import { css } from "@emotion/react";
import {
  getInitialRequireAuthenticationProps,
  RequireAuthentication,
} from "modules/auth/components/RequireAuthentication";
import { ControlledDropdownInput } from "modules/input/components/ControlledDropdownInput";
import { StatusLine } from "modules/ui/components/StatusLine";
import { GenericButton } from "modules/ui/components/GenericButton";
import { ButtonList } from "modules/ui/components/ButtonList";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { ProgressBar } from "modules/ui/components/ProgressBar";
import { InternalLink } from "modules/ui/components/InternalLink";

const breakpoint = 550;

const Container = styled.div``;

const Instruction = styled.h2`
  font-size: 1.2em;
  margin-bottom: 16px;
`;

const StyledForm = styled(Form)`
  display: grid;
  align-content: start;

  grid-template-columns: 1fr 1fr;
  grid-template-areas: "name categories" "header header" "description description" "footer footer";
  gap: 24px;

  @media (max-width: ${breakpoint}px) {
    grid-template-columns: 1fr;
    grid-template-areas: "name" "categories" "header" "description" "footer";
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  grid-area: footer;
`;

const Field = styled(FormField as FormFieldWithProps<{ area: string }>)`
  grid-area: ${(props) => props.area};
`;

const Step = styled.div<{ active: boolean }>`
  margin-top: 32px;

  ${(props) => {
    if (!props.active)
      return css`
        opacity: 0.3;
        pointer-events: none;
      `;
  }}
`;

const UploadText = styled.span``;

const UploadFooter = styled.div`
  margin-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Upload = observer(() => {
  const { videoUploadStore, organizationStore } = useStores();

  const { form, organizationId, videoId } = videoUploadStore;
  const organization = organizationStore.getResourceById(organizationId);

  const { file, upload } = videoUploadStore;
  const progress = upload?.progress || 0;
  const uploadStatus = upload?.status || "idle";

  const renderStatusText = () => {
    if (uploadStatus === "idle") return "Venter...";
    if (uploadStatus === "uploading") return `Laster opp (${Math.round(progress * 100)}%)`;
    if (uploadStatus === "failed") return "Noe gikk galt...";
    if (uploadStatus === "completed") {
      return <InternalLink href={`/video/${videoId}`}>Ferdig! Klikk her for å gå til videosiden</InternalLink>;
    }
  };

  const [status, handleSubmit] = useFormSubmission(form, async () => {
    await videoUploadStore.start();
  });

  const handleSelectFile = (files: File[]) => {
    videoUploadStore.file = files[0];
  };

  const renderFilePrompt = () => (
    <Step active={!file}>
      <Instruction>1. Velg video</Instruction>
      <FileInput onChange={handleSelectFile} label={file ? file.name : "Trykk for å velge en videofil"} />
    </Step>
  );

  const renderVideoForm = () => (
    <Step active={!!file && !upload}>
      <Instruction>2. Fyll ut videoinformasjon</Instruction>
      <StyledForm form={form} onSubmit={handleSubmit}>
        <Field area="name" label="Tittel" name="name">
          <ControlledTextInput name="name" />
        </Field>
        <Field area="categories" label="Kategori" name="categories">
          <ControlledDropdownInput name="categories" />
        </Field>
        <Field area="header" label="Underskrift" name="header">
          <ControlledTextInput name="header" />
        </Field>
        <Field area="description" label="Beskrivelse" name="description">
          <ControlledTextInput multiline name="description" />
        </Field>
        <FormFooter>
          <StatusLine {...status} />
          <ButtonList horizontal>
            <GenericButton variant="primary" onClick={handleSubmit} label="Last opp" />
            <GenericButton variant="secondary" onClick={() => videoUploadStore.cancel()} label="Avbryt" />
          </ButtonList>
        </FormFooter>
      </StyledForm>
    </Step>
  );

  const renderUpload = () => (
    <Step active={!!upload}>
      <Instruction>3. Vent på opplastning</Instruction>
      <ProgressBar value={upload?.progress || 0} />
      <UploadFooter>
        <UploadText>{renderStatusText()}</UploadText>
        <GenericButton variant="primary" color="danger" onClick={() => videoUploadStore.cancel()} label="Avbryt" />
      </UploadFooter>
    </Step>
  );

  return (
    <Container>
      <h1>Last opp video for {organization.data.name}</h1>
      {renderFilePrompt()}
      {renderVideoForm()}
      {renderUpload()}
    </Container>
  );
});

const UploadPage = createResourcePageWrapper<Organization>({
  getFetcher: (query, manager) => {
    const { organizationStore } = manager.stores;
    const { orgID } = query;

    const safeOrgId = Number(orgID) ?? 0;
    return organizationStore.fetchById(safeOrgId);
  },
  renderContent: () => (
    <RequireAuthentication>
      <Upload />
    </RequireAuthentication>
  ),
  getInitialProps: async (o, context) => {
    await getInitialRequireAuthenticationProps(context);
  },
});

export default UploadPage;
