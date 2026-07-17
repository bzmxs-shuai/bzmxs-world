import { getAllPosts } from "@/lib/posts";
import { FolioExploreClient } from "@/components/folio/FolioExploreClient";

export default function HomePage() {
  const posts = getAllPosts();
  return <FolioExploreClient posts={posts} />;
}
