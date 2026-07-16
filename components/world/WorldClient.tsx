"use client";

import dynamic from "next/dynamic";
import type { Post } from "@/lib/posts";
import { LoadingScreen } from "@/components/interface/LoadingScreen";

const WorldScene = dynamic(() => import("@/components/world/WorldScene").then((mod) => mod.WorldScene), {
  ssr: false,
  loading: () => <LoadingScreen progress={42} />,
});

export function WorldClient({ posts }: { posts: Post[] }) {
  return <WorldScene posts={posts} />;
}
