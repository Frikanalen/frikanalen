import styled from "@emotion/styled";
import { useObserver } from "mobx-react-lite";
import { EmptyState, EmptyStateProps } from "modules/ui/components/EmptyState";
import { useEffect } from "react";
import { Resource } from "../classes/Resource";
import { ResourceFetcher } from "../classes/ResourceFetcher";
import { ErrorType } from "../helpers/interpretError";

const Container = styled.div`
  margin: 128px 0px;
`;

export type FetcherViewProps<R extends Resource<D>, D> = {
  fetcher: ResourceFetcher<R, D>;
  renderContent: (resource: R) => JSX.Element;
  getEmptyStateProps: (error: ErrorType) => EmptyStateProps;
};

export function FetcherView<R extends Resource<D>, D>(props: FetcherViewProps<R, D>) {
  const { fetcher, renderContent, getEmptyStateProps } = props;

  const { resource, fetching, error } = useObserver(() => ({
    resource: fetcher.resource,
    fetching: fetcher.fetching,
    error: fetcher.error,
  }));

  useEffect(() => {
    if (!resource && !fetching) {
      fetcher.fetch();
    }
  }, [resource, fetching, fetcher]);

  if (resource) {
    return renderContent(resource);
  }

  if (error) {
    return (
      <Container>
        <EmptyState {...getEmptyStateProps(error)} />
      </Container>
    );
  }

  // FIXME: This is a placeholder
  return <span>Vent litt...</span>;
}
