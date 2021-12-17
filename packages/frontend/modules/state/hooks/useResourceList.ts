import { List } from "../classes/List";
import { Resource } from "../classes/Resource";
import { useObserver } from "./useObserver";

// TODO: Fix this, it used useObserver in the past which has been deprecated
export const useResourceList = <R extends Resource<any>>(
  list: List<number, any>,
  store: {
    getResourceById: (id: number) => R;
  }
) => {
  const resources = useObserver(() => list.items.map((id) => store.getResourceById(id)));
  return resources;
};
