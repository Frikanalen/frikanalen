import styled from "@emotion/styled";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { api } from "modules/network";
import { useStores } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import React from "react";
import { RegisterForm } from "../forms/createRegisterForm";

const Field = styled(FormField)`
  margin-bottom: 16px;
`;

export type RegisterModalProps = {
  form: RegisterForm;
};

export function RegisterModal(props: RegisterModalProps) {
  const { form } = props;

  const modal = useModal();
  const { authStore } = useStores();

  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      try {
        await api.post("/user/register", {
          ...form.serialized,

          // Hardcoded awaiting change of database schema
          dateOfBirth: "2020-07-24",
        });

        await authStore.authenticate();

        modal.dismiss();
      } catch (e) {
        // TODO: Show error in UI
      }
    }
  };

  return (
    <PrimaryModal.Container>
      <Form form={form}>
        <PrimaryModal.Header title="Registrer" />
        <PrimaryModal.Body>
          <p>
            Her kan du opprette en bruker for tilgang til innmeldingsskjema <br />
            og andre medlemsfunksjoner på siden.
          </p>
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
          <PrimaryModal.Actions>
            <GenericButton onClick={handleSubmit} label="OK" />
          </PrimaryModal.Actions>
        </PrimaryModal.Footer>
      </Form>
    </PrimaryModal.Container>
  );
}
