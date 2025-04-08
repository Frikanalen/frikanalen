import { PageLayout } from "@/app/about/pageLayout";
import { videosList } from "@/generated/videos/videos";

export const SearchResults = async ({ query }: { query: string }) => {
  const data = await videosList({
    name_Icontains: query,
  });
  return (
    <PageLayout>
      <h2 className={"text-2xl font-bold"}>Søkeresultater</h2>
      {data.results.map((video) => (
        <div key={video.id}>{video.name}</div>
      ))}
    </PageLayout>
  );
};
