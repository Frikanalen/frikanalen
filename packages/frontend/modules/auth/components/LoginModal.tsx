import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { StatusLine } from "modules/ui/components/StatusLine";
import { linkStyle } from "modules/ui/styles/linkStyle";
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
  ${linkStyle}
`;

export function LoginModal(props: LoginModalProps) {
  const { form } = props;

  const manager = useManager();
  const modal = useModal();

  const { authStore, networkStore } = manager.stores;
  const { api } = networkStore;

  const [status, handleSubmit] = useFormSubmission(
    form,
    async (serialized) => {
      await api.post("/user/login", serialized);
      await authStore.authenticate();

      modal.dismiss();
    },
    (e) => {
      const { response } = e as AxiosError;

      if (response?.status === 400) {
        return ["error", "Feil brukernavn eller passord"];
      }

      return ["error", "Noe gikk galt, prøv igjen senere"];
    }
  );

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
          <StatusLine {...status} />
          <PrimaryModal.Actions>
            <GenericButton variant="primary" onClick={handleSubmit} label="Logg inn" />
            <GenericButton variant="secondary" onClick={() => modal.dismiss()} label="Avbryt" />
          </PrimaryModal.Actions>
        </PrimaryModal.Footer>
      </Form>
    </PrimaryModal.Container>
  );
}
