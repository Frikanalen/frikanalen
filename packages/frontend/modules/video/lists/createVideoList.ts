import { ApiCollection } from "modules/network/types";
import { List } from "modules/state/classes/List";
import { ListFactory } from "modules/state/types";
import { VideoData } from "../types";

export type Params = {
  q: string;
  organization: number;
};

export type Data = {
  path: string;
};

export const createVideoList: ListFactory<Data, Params> = (data, manager) => {
  const { path } = data;
  const { videoStore, networkStore } = manager.stores;

  return new List<number, Params>({
    fetch: async (options) => {
      const { api } = networkStore;
      const { params, limit, offset } = options;

      const result = await api.get<ApiCollection<VideoData>>(path, {
        params: {
          ...params,
          page_size: limit,
          page: offset,
        },
      });

      const { results, next } = result.data;
      const mappedIds = results.map((r) => videoStore.add(r));

      return {
        newItems: mappedIds,
        newOffset: offset + 1,
        hasMore: !!next,
      };
    },
  });
};

export type VideoList = ReturnType<typeof createVideoList>;
