import React, {useState, useEffect, useContext} from "react";
import {useRouter} from "next/router";
import {UserContext, UserContextLoggedInState} from "../../components/UserContext";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import configs from "../../components/configs";
import {z} from 'zod';

import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";
import {fkOrgSchema} from "../../components/TS-API/API";
import {ErrorsIfAny} from "../../components/TS-API/formUtils";
import {Row} from "react-bootstrap";

const fkNewOrgSchema = z.object({
    name: z.string().min(3, {message: "Organisasjonsnavn må være minst tre tegn"}),
    postalAddress: z.string().nonempty({message: "Påkrevd"}),
    streetAddress: z.string().nonempty({message: "Påkrevd"}),
    homepage: z.string().url({message: "En gyldig URL er påkrevd"}),
    orgnr: z.string().length(9, {message: "Organisasjonsnummer er påkrevd, ni siffer"})
})

const brregAdresseSchema = z.object({
    adresse: z.string().array(),
    kommune: z.string(),
    postnummer: z.string(),
    poststed: z.string(),
})

type brregAdresse = z.infer<typeof brregAdresseSchema>

const brregDataSchema = z.object({
    navn: z.string(),
    postadresse: brregAdresseSchema,
    forretningsadresse: brregAdresseSchema
})

type brregData = z.infer<typeof brregDataSchema>

function NewOrgForm() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string[]; }>();
    const [formError, setFormError] = useState<JSX.Element>();
    const [name, setName] = useState("");
    const [orgnr, setOrgnr] = useState("");
    const [postalAddress, setPostalAddress] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [homepage, setHomepage] = useState("");
    const user = useContext(UserContext) as UserContextLoggedInState;

    const createOrganization = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        try {
            const newOrg = fkNewOrgSchema.parse({
                name,
                orgnr,
                postalAddress,
                streetAddress,
                homepage,
            })

            const response = await fetch(`${configs.api}organization/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newOrg),
            });

            if (!response.ok) throw new Error(`Serverfeil: ${await response.text()}`)

            const createdOrg = fkOrgSchema.parse(await response.json());

            user.refresh(user.token)

            void router.push("/organization/[id]/admin", `/organization/${createdOrg.id}/admin`);
        } catch (exception) {
            if (exception instanceof z.ZodError) {
                setFieldErrors(exception.flatten().fieldErrors)
            } else if (exception instanceof Error) {
                setFormError(<p>{exception.message}</p>)
            } else {
                throw(exception)
            }
            console.log(exception)
            return;
        }
    };


    useEffect(() => {
        const formatAddress = (a: brregAdresse): string => {
            let retVal = "";
            retVal += a.adresse.join("\n");
            retVal += "\n";
            retVal += `${a.postnummer} ${a.poststed}`;
            return retVal;
        };

        const titleCase = (titleToRecase: string): string => {
            const splitStr = titleToRecase.toLowerCase().split(" ");

            const exceptions = ["i", "og", "for", "mot", "ved", "av"];

            for (let i = 0; i < splitStr.length; i += 1) {
                if (exceptions.indexOf(splitStr[i]) === -1) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
                }
            }

            return splitStr.join(" ");
        };

        const fetchBrreg = async (brregID: string): Promise<brregData> => {
            const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${brregID}`);
            if(!res.ok) throw new Error(`Nettverksfeil ved henting fra brreg: ${await res.text()}`)
            const data = brregDataSchema.parse(await res.json());
            return data;
        };

        if (orgnr.length === 9 && !Number.isNaN(parseInt(orgnr, 10))) {
            void fetchBrreg(orgnr).then((org) => {
                setName(titleCase(org.navn));
                setPostalAddress(`${titleCase(org.navn)}\n${formatAddress(org.postadresse)}`);
                setStreetAddress(`${titleCase(org.navn)}\n${formatAddress(org.forretningsadresse)}`);
            });
        }
    }, [orgnr]);

    return (
        <Card body bg="bright" className="text-dark">
            <Form onSubmit={createOrganization}>
                <Form.Group className="mb-3">
                    <Form.Label>Organisasjonsnummer</Form.Label>
                    <Form.Control onChange={(e) => setOrgnr(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Organisasjonsnavn</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} isInvalid={!!fieldErrors?.name}/>
                    <ErrorsIfAny error={fieldErrors?.name}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Hjemmeside</Form.Label>
                    <Form.Control onChange={(e) => setHomepage(e.target.value)}
                                  isInvalid={!!fieldErrors?.homepage}
                    />
                    <ErrorsIfAny error={fieldErrors?.homepage} />
                </Form.Group>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Postadresse</Form.Label>
                        <Form.Control
                            as="textarea"
                            style={{ height: '150px',    resize: 'none'
                            }}
                            value={postalAddress}
                            isInvalid={!!fieldErrors?.postalAddress}
                            onChange={(e) => setPostalAddress(e.target.value)}
                        />
                        <ErrorsIfAny error={fieldErrors?.streetAddress} />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Besøksadresse</Form.Label>
                        <Form.Control
                            as="textarea"
                            style={{ height: '150px',    resize: 'none' }}
                            value={streetAddress}
                            isInvalid={!!fieldErrors?.streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                        />
                        <ErrorsIfAny error={fieldErrors?.streetAddress} />
                    </Form.Group>
                </Row>
                <br/>
                <Form.Row>
                    <Col className="text-right">
                        {formError}
                        <Button variant="primary" type="submit">
                            Opprett
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </Card>
    );
}

export default function RegisterOrganization() {
    return (
        <Layout>
            <WindowWidget>
                <h2>Opprett medlemskap</h2>
                <p>Her kan du opprette en ny organisasjon i vår database.</p>
                <p>
                    Du vil umiddelbart kunne laste opp innhold, men for at organisasjonens innhold skal være synlig for
                    andre
                    eller sendes på sendeplanen, må betalt kontingent være registrert, og en redaktørerklæring være
                    mottatt.
                </p>
                <p>
                    Privatpersoner kan også melde seg inn i Frikanalen og sende innhold som en organisasjon, men de vil
                    likevel
                    måtte inkludere besøks- og postadresse i henhold til{" "}
                    <a href="https://lovdata.no/lov/1992-12-04-127/§2-16">Kringkastingsloven §2-16</a>, og vil ikke ha
                    medlemsrettigheter i Frikanalen, som blant annet stemmerett.
                </p>{" "}
                <p>
                    En mal for redaktørerklæring vil være tilgjengelig for nedlasting på organisasjonens side. Utelat i
                    så fall
                    organisasjonsnummer, sett organisasjonsnavn til ditt fulle navn.
                </p>
                <Alert variant="success">
                    Tips: Om du taster inn organisasjonsnummer vil skjemaet automatisk hente navn og postadresse fra
                    Brønnøysund
                </Alert>
                <NewOrgForm />
            </WindowWidget>
        </Layout>
    );
}
