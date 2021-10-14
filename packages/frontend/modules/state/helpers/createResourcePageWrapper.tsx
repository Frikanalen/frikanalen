import { EmptyStateProps } from "modules/ui/components/EmptyState";
import { NextPageContext } from "next";
import React from "react";
import { Resource } from "../classes/Resource";
import { ResourceFetcher } from "../classes/ResourceFetcher";
import { FetcherView } from "../components/FetcherView";
import { useManager } from "../manager";
import { Manager } from "../types";
import { errorToStatusMap, ErrorType } from "./interpretError";

const getDefaultEmptyStateProps = (error: ErrorType): EmptyStateProps => {
  if (error === "not-found") {
    return {
      icon: "magnifyingGlass",
      title: "Ikke funnet (404)",
      subtitle: "Ressursen du ser etter finnes ikke",
    };
  }

  return {
    icon: "fire",
    title: "Intern serverfeil (500)",
    subtitle: "Prøv igjen senere",
  };
};

export type CreateResourcePageWrapperOptions<R extends Resource<any>> = {
  getFetcher: (query: NextPageContext["query"], manager: Manager) => ResourceFetcher<R, R["data"]>;
  getEmptyStateProps?: (error: ErrorType) => EmptyStateProps;
  getInitialProps?: (resource: R, context: NextPageContext) => Promise<object | void>;
  renderContent: (resource: R) => JSX.Element;
};

export type WrapperProps = {
  query: NextPageContext["query"];
};

export const createResourcePageWrapper = <R extends Resource<any>>(options: CreateResourcePageWrapperOptions<R>) => {
  const { getFetcher, renderContent, getInitialProps, getEmptyStateProps = getDefaultEmptyStateProps } = options;

  function Wrapper(props: WrapperProps) {
    const { query } = props;

    const manager = useManager();
    const fetcher = getFetcher(query, manager);

    return <FetcherView fetcher={fetcher} getEmptyStateProps={getEmptyStateProps} renderContent={renderContent} />;
  }

  Wrapper.getInitialProps = async (context: NextPageContext) => {
    const { query, manager, res } = context;
    const fetcher = getFetcher(query, manager);

    let props = { query };

    // Only fetch if it hasn't been fetched already
    if (!fetcher.resource && !fetcher.fetching) {
      await fetcher.fetch();
    }

    if (fetcher.resource && getInitialProps) {
      const extraProps = await getInitialProps(fetcher.resource, context);

      if (extraProps) {
        props = { ...extraProps, ...props };
      }
    }

    if (fetcher.error && res) {
      res.statusCode = errorToStatusMap[fetcher.error];
    }

    return props;
  };

  return Wrapper;
};
