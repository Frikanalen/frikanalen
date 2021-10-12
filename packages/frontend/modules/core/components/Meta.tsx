import React from "react";
import Head from "next/head";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import { CANONICAL_HOST, WEBSITE_NAME } from "../constants";

const MAX_LENGTH = 300;

const getSafeString = (str = "") => {
  if (!str) return "";
  if (str.length > MAX_LENGTH) return str.slice(0, MAX_LENGTH).trim() + "...";

  return str;
};

export type MetaInformation = {
  title: string;
  description: string;
  author?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "object";
};

export type MetaProps = {
  meta: MetaInformation;
};

export function Meta(props: MetaProps) {
  const router = useRouter();
  const theme = useTheme();

  const { meta } = props;
  const { title, description, image, type, author } = meta;

  const keywords = [""];

  const renderDescription = (description: string) => {
    return (
      <>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
      </>
    );
  };

  const ogTags = (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:url" content={`${CANONICAL_HOST}${router.pathname}`} />
      <meta property="og:site_name" content={WEBSITE_NAME} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {author && <meta property="article:author" content={author} />}
    </>
  );

  const twitterTags = (
    <>
      {image && <meta name="twitter:image:src" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
    </>
  );

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="viewport" content="initial-scale=1" />
      <meta name="theme-color" content={theme.color.accent} />
      <title>{title !== WEBSITE_NAME ? `${title} - ${WEBSITE_NAME}` : WEBSITE_NAME}</title>
      {ogTags}
      {twitterTags}
      {renderDescription(getSafeString(description))}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Head>
  );
}
