import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { AspectContainer } from "modules/core/components/AspectContainer";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { GenericButton } from "modules/ui/components/GenericButton";
import { StatusLine } from "modules/ui/components/StatusLine";
import React from "react";
import { TextSlideForm } from "../forms/createTextSlideForm";
import {useManager} from "../../state/manager";

const Container = styled(PrimaryModal.Container)`
  width: 650px;
`;

const Field = styled(FormField)`
  margin-bottom: 16px;
`;

const Preview = styled.div`
  width: 100%;
  height: 100%;

  background-size: cover;
`;

export type TextSlideModalProps = {
  form: TextSlideForm;
};

export const TextSlideModal = observer((props: TextSlideModalProps) => {
  const { form } = props;
  const { heading, text } = form.fields;
  const manager = useManager();
  const { networkStore } = manager.stores;
  const { api } = networkStore;

  const modal = useModal();

  const [status, handleSubmit] = useFormSubmission(form, async (serialized) => {
    await api.post("/playout/atem/poster/upload", serialized);

    modal.dismiss();
  });

  const previewURL = `/api/playout/atem/poster/preview?text=${encodeURIComponent(
    text.value
  )}&heading=${encodeURIComponent(heading.value)}`;

  return (
    <Container>
      <PrimaryModal.Header title="Sendingsplakat" />
      <PrimaryModal.Body>
        <Form form={form}>
          <Field label="Overskrift" name="heading">
            <ControlledTextInput autoFocus name="heading" />
          </Field>
          <Field label="Tekst" name="text">
            <ControlledTextInput name="text" />
          </Field>
          <AspectContainer width={1280} height={720}>
            <Preview style={{ backgroundImage: `url(${previewURL})` }} />
          </AspectContainer>
        </Form>
      </PrimaryModal.Body>
      <PrimaryModal.Footer>
        <StatusLine {...status} />
        <PrimaryModal.Actions>
          <GenericButton variant="primary" onClick={handleSubmit} label="Lagre" />
          <GenericButton variant="secondary" onClick={() => modal.dismiss()} label="Lukk" />
        </PrimaryModal.Actions>
      </PrimaryModal.Footer>
    </Container>
  );
});
