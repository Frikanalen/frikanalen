"use client";

import Link from "next/link";
import { PageLayout } from "@/app/about/pageLayout";
import { useParams } from "next/navigation";

export default function NotFound() {
  const { videoId } = useParams<{ videoId: string }>();
  return (
    <PageLayout>
      <div className={"p-12 prose-xl"}>
        <h1 className={"text-4xl"}>404 Not Found</h1>
        <p>Ingen videoer eksisterer med ID «{videoId}».</p>
        <Link href="/archive">Til mediearkivet</Link>
      </div>
    </PageLayout>
  );
}
