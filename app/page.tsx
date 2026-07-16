import { getAllPosts } from "@/lib/posts";
import { WorldClient } from "@/components/world/WorldClient";

export default function HomePage() {
  const posts = getAllPosts();
  return <WorldClient posts={posts} />;
}
