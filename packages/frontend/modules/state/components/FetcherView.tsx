import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { Meta } from "modules/core/components/Meta";
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

export const FetcherView = observer(<R extends Resource<D>, D>(props: FetcherViewProps<R, D>) => {
  const { fetcher, renderContent, getEmptyStateProps } = props;
  const { resource, fetching, error } = fetcher;

  useEffect(() => {
    if (!resource && !fetching) {
      fetcher.fetch();
    }
  }, [resource, fetching, fetcher]);

  if (resource) {
    return renderContent(resource);
  }

  if (error) {
    const emptyStateProps = getEmptyStateProps(error);
    const { title, subtitle } = emptyStateProps;

    return (
      <Container>
        <Meta
          meta={{
            title,
            description: subtitle || "",
          }}
        />
        <EmptyState {...emptyStateProps} />
      </Container>
    );
  }

  // FIXME: This is a placeholder
  return <span>Vent litt...</span>;
});
