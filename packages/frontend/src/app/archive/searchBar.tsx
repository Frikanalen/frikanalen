"use client";
import { Input } from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";

export const SearchBar = ({ initialQuery }: { initialQuery: string }) => (
  <form method="GET" action="/archive/search">
    <div className="p-4 rounded-2xl flex bg-gray-900/30  text-white shadow-lg">
      <Input
        isClearable
        defaultValue={initialQuery}
        classNames={{
          label: "text-black/50 dark:text-white/90 -mt-6",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/90 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focus=true]:bg-default-200/50",
            "dark:group-data-[focus=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        name="query"
        placeholder="Skriv for å søke..."
        radius="lg"
        startContent={
          <SearchIcon className="mb-0.5 dark:text-white/90 text-slate-700 pointer-events-none flex-shrink-0" />
        }
      />
    </div>
  </form>
);
