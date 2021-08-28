import styled from "@emotion/styled";
import { Form } from "modules/form/components/Form";
import { FormField } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { PrimaryModal } from "modules/modal/components/PrimaryModal";
import { useModal } from "modules/modal/hooks/useModal";
import { api } from "modules/network";
import { useStores } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { LoginForm } from "../forms/createLoginForm";

export type LoginModalProps = {
  form: LoginForm;
};

const Field = styled(FormField)`
  margin-bottom: 16px;
`;

export function LoginModal(props: LoginModalProps) {
  const { authStore } = useStores();
  const modal = useModal();
  const { form } = props;

  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      try {
        await api.post("/user/login", form.serialized);
        await authStore.authenticate();

        modal.dismiss();
      } catch (e) {
        // TODO: Show error in UI
      }
    }
  };

  return (
    <PrimaryModal.Container>
      <Form onSubmit={handleSubmit} form={form}>
        <PrimaryModal.Header title="Logg inn" />
        <PrimaryModal.Body>
          <Field label="E-post" name="email">
            <ControlledTextInput placeholder="ola-nordmann@addresse.no" autoFocus name="email" />
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
