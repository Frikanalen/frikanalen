import React, { useState } from "react";
import styled from "@emotion/styled";
import { RequireAuthentication } from "modules/auth/components/RequireAuthentication";
import { Form } from "modules/form/components/Form";
import { FormField, FormFieldWithProps } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { useManager } from "modules/state/manager";
import { createProfileForm } from "modules/user/forms/createProfileForm";
import { GenericButton } from "modules/ui/components/GenericButton";
import { StatusLine } from "modules/ui/components/StatusLine";
import { useFormSubmission } from "modules/form/hooks/useFormSubmission";
import { User } from "modules/user/schemas";
import { Section } from "modules/ui/components/Section";
import { OrganizationRoleItem } from "modules/user/components/OrganizationRoleItem";
import { Meta } from "modules/core/components/Meta";

const Container = styled.div``;

const Content = styled.div`
  display: flex;
`;

const FormContainer = styled(Form)`
  margin-top: 16px;
  flex: 1;

  display: grid;
  align-content: start;

  grid-template-columns: 1fr;
  grid-template-areas: "firstName" "lastName" "phoneNumber" "footer";
  gap: 24px;
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

const OrganizationSection = styled(Section)`
  width: 400px;
  margin-left: 32px;
`;

function Profile() {
  const manager = useManager();

  const { authStore, networkStore } = manager.stores;
  const { api } = networkStore;
  const user = authStore.user!;

  const [form] = useState(() => createProfileForm(user, manager));

  const [status, handleSubmit] = useFormSubmission(form, async (serialized) => {
    const { data } = await api.put<User>("/user", serialized);

    // TODO: Fix this, users should be in a resource store
    Object.assign(authStore.user, data);
  });

  return (
    <Container>
      <h1>Din profil</h1>
      <Meta
        meta={{
          title: "Din profil",
          description: "",
        }}
      />
      <Content>
        <FormContainer onSubmit={handleSubmit} form={form}>
          <Field area="firstName" label="Fornavn" name="firstName">
            <ControlledTextInput name="firstName" />
          </Field>
          <Field area="lastName" label="Etternavn" name="lastName">
            <ControlledTextInput name="lastName" />
          </Field>
          <Field area="phoneNumber" label="Mobilnummer" name="phoneNumber">
            <ControlledTextInput name="phoneNumber" />
          </Field>
          <FormFooter>
            <StatusLine {...status} />
            <GenericButton variant="primary" onClick={handleSubmit} label="Lagre" />
          </FormFooter>
        </FormContainer>
        <OrganizationSection icon="officeBuilding" title="Organisasjoner du er medlem av">
          <ul>
            {user.organizationRoles.map((r) => (
              <OrganizationRoleItem key={r.organizationId} role={r} />
            ))}
          </ul>
        </OrganizationSection>
      </Content>
    </Container>
  );
}

export default function Page() {
  return (
    <RequireAuthentication>
      <Profile />
    </RequireAuthentication>
  );
}

Page.getInitialProps = RequireAuthentication.getInitialProps;
