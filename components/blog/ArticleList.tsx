import type { BlogArea, Post } from "@/lib/posts";
import { ArticleCard } from "./ArticleCard";

const areaTitles: Record<BlogArea | "all", string> = {
  all: "全部文章",
  library: "图书馆",
  "training-ground": "训练场",
  home: "小房子",
  laboratory: "实验室",
  museum: "博物馆",
};

export function ArticleList({ posts, area = "all" }: { posts: Post[]; area?: BlogArea | "all" }) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-800">Reading Mode</p>
          <h2 className="text-3xl font-semibold text-stone-950">{areaTitles[area]}</h2>
        </div>
        <span className="rounded-lg bg-white/75 px-3 py-2 text-sm text-stone-600">{posts.length} 篇</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
