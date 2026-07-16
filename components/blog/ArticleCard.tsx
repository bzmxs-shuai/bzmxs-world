import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const areaLabel: Record<PostMeta["area"], string> = {
  library: "图书馆",
  "training-ground": "训练场",
  home: "小房子",
  laboratory: "实验室",
  museum: "博物馆",
};

export function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border border-amber-200 bg-amber-50/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-800">{areaLabel[post.area]}</span>
        <span>{post.category}</span>
        {post.problemId ? <span>{post.problemId}</span> : null}
        {post.difficulty ? <span>{post.difficulty}</span> : null}
      </div>
      <h3 className="mt-3 text-xl font-semibold text-stone-900 group-hover:text-emerald-800">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{post.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded bg-white/80 px-2 py-1 text-xs text-stone-600">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
