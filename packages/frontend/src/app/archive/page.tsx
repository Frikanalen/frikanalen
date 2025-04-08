import { SearchBar } from "@/app/archive/searchBar";
import { VideoSpotlight } from "@/app/archive/videoSpotlight";
import { Metadata } from "next";
import { videosList } from "@/generated/videos/videos";

export const metadata: Metadata = {
  title: "Frikanalen - mediatek",
  description: "Medlemmers videoarkiv",
};

export default async function Archive() {
  const newestVideo = await videosList({ limit: 2 });
  return (
    <div className={"flex flex-col gap-8"}>
      <SearchBar initialQuery={""} />
      <VideoSpotlight video={newestVideo.results[1]} />
    </div>
  );
}
