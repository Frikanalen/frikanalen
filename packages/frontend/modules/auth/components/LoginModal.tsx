import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { api } from "modules/network";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { StatusLine, StatusType } from "modules/ui/components/StatusLine";
import { useState } from "react";
import { LoginForm } from "../forms/createLoginForm";
import { spawnRegisterModal } from "../helpers/spawnRegisterModal";

export type LoginModalProps = {
  form: LoginForm;
};

const Field = styled(FormField)`
  margin-bottom: 16px;
`;

const RegisterLink = styled.a`
  cursor: pointer;
`;

export function LoginModal(props: LoginModalProps) {
  const { form } = props;

  const manager = useManager();
  const modal = useModal();

  const [status, setStatus] = useState<[StatusType, string]>(["info", ""]);
  const [type, message] = status;

  const { authStore } = manager.stores;

  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      setStatus(["info", "Vent litt..."]);

      try {
        await api.post("/user/login", form.serialized);
        await authStore.authenticate();

        modal.dismiss();
      } catch (e) {
        const { response } = e as AxiosError;

        if (response?.status === 400) {
          return setStatus(["error", "Feil brukernavn eller passord"]);
        }

        setStatus(["error", "Noe gikk galt, prøv igjen senere"]);
      }
    }
  };

  const handleRegisterClick = () => {
    modal.dismiss();
    spawnRegisterModal(manager);
  };

  return (
    <PrimaryModal.Container>
      <Form onSubmit={handleSubmit} form={form}>
        <PrimaryModal.Header title="Logg inn" />
        <PrimaryModal.Body>
          <Field label="E-post" name="email">
            <ControlledTextInput placeholder="epost@webside.no" autoFocus name="email" />
          </Field>
          <Field label="Passord" name="password">
            <ControlledTextInput type="password" name="password" />
          </Field>
          <RegisterLink onClick={handleRegisterClick}>Registrer ny konto?</RegisterLink>
        </PrimaryModal.Body>
        <PrimaryModal.Footer>
          <StatusLine message={message} type={type} />
          <PrimaryModal.Actions>
            <GenericButton onClick={handleSubmit} label="OK" />
          </PrimaryModal.Actions>
        </PrimaryModal.Footer>
      </Form>
    </PrimaryModal.Container>
  );
}
