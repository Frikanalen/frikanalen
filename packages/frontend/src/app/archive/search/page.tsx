import { SearchBar } from "@/app/archive/searchBar";
import { SearchResults } from "@/app/archive/searchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frikanalen - mediatek - søk",
  description: "Medlemmers videoarkiv",
};
export default function Search({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query || "";
  return (
    <div className={"flex flex-col gap-8"}>
      <SearchBar initialQuery={query} />
      <SearchResults query={query} />
    </div>
  );
}
