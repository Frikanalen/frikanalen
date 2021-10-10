import styled from "@emotion/styled";
import axios from "axios";
import { useObserver } from "mobx-react-lite";
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
import { STILLS_GENERATOR_URL } from "../constants";
import { TextSlideForm } from "../forms/createTextSlideForm";

const Body = styled(PrimaryModal.Body)`
  min-width: 650px;
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

export function TextSlideModal(props: TextSlideModalProps) {
  const { form } = props;
  const { heading, text } = form.fields;

  const modal = useModal();

  const [status, handleSubmit] = useFormSubmission(form, async (serialized) => {
    await axios.post("/poster/upload", serialized, {
      baseURL: STILLS_GENERATOR_URL,
    });

    modal.dismiss();
  });

  const [type, message] = status;

  const previewURL = useObserver(
    () =>
      `${STILLS_GENERATOR_URL}/poster/preview?text=${encodeURIComponent(text.value)}&heading=${encodeURIComponent(
        heading.value
      )}`
  );

  return (
    <PrimaryModal.Container>
      <Form form={form}>
        <PrimaryModal.Header title="Sendingsplakat" />
        <Body>
          <Field label="Overskrift" name="heading">
            <ControlledTextInput autoFocus name="heading" />
          </Field>
          <Field label="Tekst" name="text">
            <ControlledTextInput name="text" />
          </Field>
          <AspectContainer width={1280} height={720}>
            <Preview style={{ backgroundImage: `url(${previewURL})` }} />
          </AspectContainer>
        </Body>
        <PrimaryModal.Footer>
          <StatusLine message={message} type={type} />
          <PrimaryModal.Actions>
            <GenericButton variant="primary" onClick={handleSubmit} label="Lagre" />
            <GenericButton variant="secondary" onClick={() => modal.dismiss()} label="Lukk" />
          </PrimaryModal.Actions>
        </PrimaryModal.Footer>
      </Form>
    </PrimaryModal.Container>
  );
}
