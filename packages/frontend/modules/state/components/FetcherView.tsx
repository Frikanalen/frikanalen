import { useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import { Resource } from "../classes/Resource";
import { ResourceFetcher } from "../classes/ResourceFetcher";

export type FetcherViewProps<R extends Resource<D>, D> = {
  fetcher: ResourceFetcher<R, D>;
  renderContent: (resource: R) => JSX.Element;
};

export function FetcherView<R extends Resource<D>, D>(props: FetcherViewProps<R, D>) {
  const { fetcher, renderContent } = props;

  const { resource, fetching } = useObserver(() => ({
    resource: fetcher.resource,
    fetching: fetcher.fetching,
  }));

  useEffect(() => {
    if (!resource && !fetching) {
      fetcher.fetch();
    }
  }, [resource, fetching, fetcher]);

  if (resource) {
    return renderContent(resource);
  }

  // FIXME: This is a placeholder
  return <span>Vent litt...</span>;
}
