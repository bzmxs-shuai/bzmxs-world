"use client";

import dynamic from "next/dynamic";
import type { Post } from "@/lib/posts";
import { LoadingScreen } from "@/components/interface/LoadingScreen";
import { FolioDebugOverlay } from "@/components/folio/FolioDebugOverlay";

const FolioWorld = dynamic(() => import("@/components/folio/FolioWorld").then((mod) => mod.FolioWorld), {
  ssr: false,
  loading: () => <LoadingScreen progress={42} />,
});

export function WorldDebugClient({ posts }: { posts: Post[] }) {
  return (
    <>
      <FolioWorld posts={posts} />
      <FolioDebugOverlay />
    </>
  );
}
