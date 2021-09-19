import { NextPageContext } from "next";
import React from "react";
import { Resource } from "../classes/Resource";
import { ResourceFetcher } from "../classes/ResourceFetcher";
import { FetcherView } from "../components/FetcherView";
import { useManager } from "../manager";
import { Manager } from "../types";

export type CreateResourcePageWrapperOptions<R extends Resource<D>, D> = {
  getFetcher: (query: NextPageContext["query"], manager: Manager) => ResourceFetcher<R, D>;
  renderContent: (resource: R) => JSX.Element;
};

export type WrapperProps = {
  query: NextPageContext["query"];
};

export const createResourcePageWrapper = <R extends Resource<D>, D>(
  options: CreateResourcePageWrapperOptions<R, D>
) => {
  const { getFetcher, renderContent } = options;

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

    return { query };
  };

  return Wrapper;
};
