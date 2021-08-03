import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { GetServerSideProps } from "next";
import Layout from "components/Layout";
import WindowWidget from "components/WindowWidget";
import { UserContext } from "../../../components/UserContext";
import {
  getCategories,
  fkCategory,
  fkOrg,
  getOrg,
  fkVideoPartial,
  APIPOST,
  fkVideoPartialSchema
} from "../../../components/TS-API/API";
import {ErrorsIfAny} from "../../../components/TS-API/formUtils";

interface VideoCreateProps {
  org: fkOrg;
  possibleCategories: fkCategory[];
}

export default function VideoCreate({ org, possibleCategories }: VideoCreateProps): JSX.Element {
  const context = useContext(UserContext);

  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string[]; }>();
  const [formError, setFormError] = useState<JSX.Element>();
  const [errors, setErrors] = useState<React.ReactNode>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [videoHeader, setVideoHeader] = useState<string>("");
  const [videoCategories, setVideoCategories] = useState<string[]>();

  if (!context.isLoggedIn) return <></>;

  const { token } = context;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const newVideo = fkVideoPartialSchema.parse({
      id: 0,
      header: videoHeader,
      name: videoName,
      description: "",
      organization: org.id,
      categories: videoCategories,
    });

    APIPOST<fkVideoPartial>({
      endpoint: "videos/",
      payload: newVideo,
      token,
    })
      .then(async (newVideoResponse) => {
        if (typeof newVideoResponse.id !== "number") throw new Error("Invalid video ID!");

        await router.push("/video/[videoID]", `/video/${newVideoResponse.id}`);
      })
      .catch((reason: Error) => {
        setErrors(<div>{reason.message}</div>);
      });
  };

  return (
    <Layout>
      <WindowWidget>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>På vegne av:</Form.Label>
            <Form.Control readOnly value={org.name} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Navn:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e): void => setVideoName(e.target.value)}
              value={videoName}
              placeholder="Kort videonavn"
              isInvalid={!!fieldErrors?.streetAddress}
            />
            <ErrorsIfAny error={fieldErrors?.streetAddress} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ingress:</Form.Label>
            <Form.Control
              type="text"
              value={videoHeader}
              onChange={(e): void => setVideoHeader(e.target.value)}
              placeholder="En relativt kortfattet beskrivelse"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori:</Form.Label>
            <Form.Control
              as="select"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                const selectedCategories = [];
                for (let i = 0; i < e.target.selectedOptions.length; i += 1) {
                  selectedCategories.push(e.target.selectedOptions[i].value);
                }
                setVideoCategories(selectedCategories);
              }}
              multiple
            >
              {possibleCategories.map((cat: fkCategory) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {errors}

          <Button variant="primary" type="submit">
            Start
          </Button>
        </Form>
      </WindowWidget>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query.orgID !== "string" || Number.isNaN(parseInt(context.query.orgID, 10))) {
    throw new Error(`Invalid organization ID!`);
  }

  const org = await getOrg(parseInt(context.query.orgID, 10));
  const possibleCategories = await getCategories();

  return {
    props: {
      org,
      possibleCategories,
    },
  };
};
