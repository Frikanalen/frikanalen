import { NextPageContext } from "next";
import React from "react";
import { Resource } from "../classes/Resource";
import { ResourceFetcher } from "../classes/ResourceFetcher";
import { FetcherView } from "../components/FetcherView";
import { useManager } from "../manager";
import { Manager } from "../types";

export type CreateResourcePageWrapperOptions<R extends Resource<any>> = {
  getFetcher: (query: NextPageContext["query"], manager: Manager) => ResourceFetcher<R, R["data"]>;
  onResource?: (resource: R) => Promise<void>;
  renderContent: (resource: R) => JSX.Element;
};

export type WrapperProps = {
  query: NextPageContext["query"];
};

export const createResourcePageWrapper = <R extends Resource<any>>(options: CreateResourcePageWrapperOptions<R>) => {
  const { getFetcher, renderContent, onResource } = options;

  function Wrapper(props: WrapperProps) {
    const { query } = props;

    const manager = useManager();
    const fetcher = getFetcher(query, manager);

    return <FetcherView fetcher={fetcher} renderContent={renderContent} />;
  }

  Wrapper.getInitialProps = async (context: NextPageContext) => {
    const { query, manager } = context;
    const fetcher = getFetcher(query, manager);

    // Only fetch if it hasn't been fetched already
    if (!fetcher.resource && !fetcher.fetching) {
      await fetcher.fetch();
    }

    if (fetcher.resource && onResource) {
      await onResource(fetcher.resource);
    }

    return { query };
  };

  return Wrapper;
};
