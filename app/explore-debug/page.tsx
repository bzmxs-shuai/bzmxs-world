import { WorldDebugClient } from "@/components/world/WorldDebugClient";
import { getAllPosts } from "@/lib/posts";

export default function ExploreDebugPage() {
  const posts = getAllPosts();
  return <WorldDebugClient posts={posts} />;
}
