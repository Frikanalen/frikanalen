import React from "react";
import styled from "@emotion/styled";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { useStores } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { StatusLine } from "modules/ui/components/StatusLine";
import { RegisterForm } from "../forms/createRegisterForm";

const Field = styled(FormField)`
  margin-bottom: 16px;
`;

const Info = styled.p`
  margin-top: 0px;
`;

export type RegisterModalProps = {
  form: RegisterForm;
};

export function RegisterModal(props: RegisterModalProps) {
  const { form } = props;

  const modal = useModal();

  const { authStore, networkStore } = useStores();
  const { api } = networkStore;

  const [status, handleSubmit] = useFormSubmission(form, async (serialized) => {
    await api.post("/user/register", {
      ...serialized,

      // Hardcoded awaiting change of database schema
      dateOfBirth: "2020-07-24",
    });

    await authStore.authenticate();

    modal.dismiss();
  });

  return (
    <PrimaryModal.Container>
      <Form form={form}>
        <PrimaryModal.Header title="Registrer" />
        <PrimaryModal.Body>
          <Info>
            Her kan du opprette en bruker for tilgang til innmeldingsskjema <br />
            og andre medlemsfunksjoner på siden.
          </Info>
          <Field label="Fornavn" name="firstName">
            <ControlledTextInput placeholder="Ola" autoFocus name="firstName" />
          </Field>
          <Field label="Etternavn" name="lastName">
            <ControlledTextInput placeholder="Nordmann" name="lastName" />
          </Field>
          <Field label="E-post" name="email">
            <ControlledTextInput placeholder="epost@webside.no" name="email" />
          </Field>
          <Field label="Passord" name="password">
            <ControlledTextInput type="password" name="password" />
          </Field>
        </PrimaryModal.Body>
        <PrimaryModal.Footer>
          <StatusLine {...status} />
          <PrimaryModal.Actions>
            <GenericButton variant="primary" onClick={handleSubmit} label="Registrer" />
            <GenericButton variant="secondary" onClick={() => modal.dismiss()} label="Avbryt" />
          </PrimaryModal.Actions>
        </PrimaryModal.Footer>
      </Form>
    </PrimaryModal.Container>
  );
}
