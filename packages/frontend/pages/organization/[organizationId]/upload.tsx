import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Form } from "modules/form/components/Form";
import { FormField, FormFieldWithProps } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { useStores } from "modules/state/manager";
import { FileInput } from "modules/input/components/FileInput";
import { css } from "@emotion/react";
import { RequireAuthentication } from "modules/auth/components/RequireAuthentication";
import { ControlledDropdownInput } from "modules/input/components/ControlledDropdownInput";
import { StatusLine } from "modules/ui/components/StatusLine";
import { GenericButton } from "modules/ui/components/GenericButton";
import { ButtonList } from "modules/ui/components/ButtonList";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { ProgressBar } from "modules/ui/components/ProgressBar";
import { InternalLink } from "modules/ui/components/InternalLink";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

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

const Upload = () => {
  const router = useRouter();
  const organizationId = parseInt(router.query.organizationId as string);
  const { videoUploadStore } = useStores();

  // Just an ugly hack to force component re-draw
  const [lol, updateState] = React.useState<string>("asdf");
  const forceUpdate = React.useCallback(() => updateState((s) => s + "f"), []);

  const { form, videoId, file, upload } = videoUploadStore;

  useEffect(() => {
    videoUploadStore.prepare(organizationId).then(() => forceUpdate());
  }, []);

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

  if (isNaN(organizationId)) return null;

  const handleSelectFile = (files: File[]) => {
    videoUploadStore.file = files[0];
    console.log("HI");
    forceUpdate();
  };

  const renderFilePrompt = () => (
    <Step active={!file}>
      <Instruction>1. Velg video</Instruction>
      <FileInput onChange={handleSelectFile} label={file ? file.name : "Trykk for å velge en videofil"} />
    </Step>
  );

  const renderVideoForm = () => (
    <Step active={!!file && !upload}>
      <div style={{ display: "none" }}>{lol}</div>
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
    <RequireAuthentication>
      <Container>
        <h1>Last opp video</h1>
        {renderFilePrompt()}
        {renderVideoForm()}
        {renderUpload()}
      </Container>
    </RequireAuthentication>
  );
};

export default dynamic(() => Promise.resolve(Upload), {
  ssr: false,
});
