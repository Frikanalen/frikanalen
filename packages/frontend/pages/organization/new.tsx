import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { RequireAuthentication } from "modules/auth/components/RequireAuthentication";
import { Form } from "modules/form/components/Form";
import { FormField, FormFieldWithProps } from "modules/form/components/FormField";
import { ControlledTextInput } from "modules/input/components/ControlledTextInput";
import { toTitleCase } from "modules/lang/string";
import { createNewOrganizationForm } from "modules/organization/forms/createNewOrganizationForm";
import { fetchBrregData } from "modules/organization/helpers/fetchBrregData";
import { formatAddress } from "modules/organization/helpers/formatAddress";
import { OrganizationData } from "modules/organization/resources/Organization";
import { useManager } from "modules/state/manager";
import { GenericButton } from "modules/ui/components/GenericButton";
import { Notice } from "modules/ui/components/Notice";
import { StatusLine, StatusType } from "modules/ui/components/StatusLine";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
`;

const FormContainer = styled.div`
  flex: 1;

  display: grid;
  align-content: start;

  grid-template-columns: 1fr 1fr;
  grid-template-areas: "number name" "homepage homepage" "postal street" "footer footer";
  gap: 24px;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  grid-area: footer;
`;

const Info = styled.div`
  width: 700px;
  margin-left: 32px;
`;

const Field = styled(FormField as FormFieldWithProps<{ area: string }>)`
  grid-area: ${(props) => props.area};
`;

function Content() {
  const router = useRouter();
  const manager = useManager();

  const { networkStore, organizationStore } = manager.stores;
  const { api } = networkStore;

  const [form] = useState(() => createNewOrganizationForm(manager));

  const [status, setStatus] = useState<[StatusType, string]>(["info", ""]);
  const [type, message] = status;

  const organizationNumber = useObserver(() => form.fields.orgnr.value);

  useEffect(() => {
    const doFetch = async () => {
      setStatus(["info", "Henter data fra registeret..."]);

      const data = await fetchBrregData(organizationNumber);

      if (!data) {
        setStatus(["error", "Kunne ikke hente data fra register, er organisasjonsnummer riktig?"]);
        return;
      }

      const safeName = toTitleCase(data.navn);
      const { name, postalAddress, streetAddress, homepage } = form.fields;

      name.setValue(safeName);
      postalAddress.setValue(`${safeName}\n${formatAddress(data.postadresse)}`);
      streetAddress.setValue(`${safeName}\n${formatAddress(data.forretningsadresse)}`);
      homepage.setValue(data.hjemmeside);

      setStatus(["info", ""]);
    };

    if (organizationNumber.length === 9 && Number.isInteger(Number(organizationNumber))) {
      doFetch();
    }
  }, [organizationNumber, form]);

  // TODO: Make this way of submitting forms more DRY
  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      setStatus(["info", "Vent litt..."]);

      try {
        const { data } = await api.post<OrganizationData>("/organization/", form.serialized);

        organizationStore.add(data);
        router.push(`/organization/${data.id}/admin`);
      } catch (e) {
        setStatus(["error", "Noe gikk galt, prøv igjen senere"]);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit} form={form}>
      <Container>
        <FormContainer>
          <Field area="number" label="Organisasjonsnummer" name="orgnr">
            <ControlledTextInput placeholder="9 siffer" autoFocus name="orgnr" />
          </Field>
          <Field area="name" label="Organisasjonsnavn" name="name">
            <ControlledTextInput name="name" />
          </Field>
          <Field area="homepage" label="Hjemmeside" name="homepage">
            <ControlledTextInput placeholder="https://webside.no" name="homepage" />
          </Field>
          <Field area="postal" label="Postadresse" name="postalAddress">
            <ControlledTextInput multiline name="postalAddress" />
          </Field>
          <Field area="street" label="Besøksadresse" name="streetAddress">
            <ControlledTextInput multiline name="streetAddress" />
          </Field>
          <FormFooter>
            <StatusLine message={message} type={type} />
            <GenericButton onClick={handleSubmit} label="Opprett" />
          </FormFooter>
        </FormContainer>
        <Info>
          <h2>Opprett medlemskap</h2>
          <p>Her kan du opprette en ny organisasjon i vår database.</p>
          <p>
            Du vil umiddelbart kunne laste opp innhold, men for at organisasjonens innhold skal være synlig for andre
            eller sendes på sendeplanen, må betalt kontingent være registrert, og en redaktørerklæring være mottatt.
          </p>
          <p>
            Privatpersoner kan også melde seg inn i Frikanalen og sende innhold som en organisasjon, men de vil likevel
            måtte inkludere besøks- og postadresse i henhold til{" "}
            <a href="https://lovdata.no/lov/1992-12-04-127/§2-16">Kringkastingsloven §2-16</a>, og vil ikke ha
            medlemsrettigheter i Frikanalen, som blant annet stemmerett.
          </p>
          <p>
            En mal for redaktørerklæring vil være tilgjengelig for nedlasting på organisasjonens side. Utelat i så fall
            organisasjonsnummer, sett organisasjonsnavn til ditt fulle navn.
          </p>
          <Notice
            type="tip"
            message="Tast inn organisasjonsnummer for å automatisk hente navn og postadresse fra Brønnøysund"
          />
        </Info>
      </Container>
    </Form>
  );
}

export default function NewOrganization() {
  return (
    <RequireAuthentication>
      <Content />
    </RequireAuthentication>
  );
}
