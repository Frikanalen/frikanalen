import { useObserver } from "mobx-react-lite";
import { List } from "../classes/List";
import { Resource } from "../classes/Resource";

export const useResourceList = <R extends Resource<any>>(
  list: List<number, any>,
  store: {
    getResourceById: (id: number) => R;
  }
) => {
  const resources = useObserver(() => list.items.map((id) => store.getResourceById(id)));
  return resources;
};
