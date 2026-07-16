"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Post } from "@/lib/posts";
import { useWorldStore, type BuildingId } from "@/store/useWorldStore";

const buildingTitles: Record<BuildingId, string> = {
  library: "图书馆 Library",
  "training-ground": "训练场 Training Ground",
  home: "小房子 Home",
};

export function ArticlePanel({ posts }: { posts: Post[] }) {
  const isOpen = useWorldStore((state) => state.isPanelOpen);
  const selectedBuilding = useWorldStore((state) => state.selectedBuilding);
  const selectedArticle = useWorldStore((state) => state.selectedArticle);
  const closePanel = useWorldStore((state) => state.closePanel);
  const selectArticle = useWorldStore((state) => state.selectArticle);

  const areaPosts = selectedBuilding ? posts.filter((post) => post.area === selectedBuilding) : [];
  const article = areaPosts.find((post) => post.slug === selectedArticle) ?? areaPosts[0];

  return (
    <AnimatePresence>
      {isOpen && selectedBuilding ? (
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed bottom-0 right-0 top-0 z-50 w-full overflow-y-auto border-l border-amber-200 bg-amber-50/95 p-5 shadow-2xl backdrop-blur md:w-[480px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-emerald-800">Area Content</p>
              <h2 className="text-2xl font-semibold text-stone-950">{buildingTitles[selectedBuilding]}</h2>
            </div>
            <button
              aria-label="关闭文章面板"
              onClick={closePanel}
              className="grid h-10 w-10 place-items-center rounded-lg bg-white text-stone-700 shadow-sm"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-6 grid gap-3">
            {areaPosts.map((post) => (
              <button
                key={post.slug}
                onClick={() => selectArticle(post.slug)}
                className={`rounded-lg border p-4 text-left transition ${
                  article?.slug === post.slug
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-amber-200 bg-white/75 hover:border-amber-400"
                }`}
              >
                <div className="text-xs text-stone-500">
                  {post.category}
                  {post.problemId ? ` · ${post.problemId}` : ""}
                  {post.difficulty ? ` · ${post.difficulty}` : ""}
                </div>
                <h3 className="mt-1 font-semibold text-stone-950">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{post.description}</p>
              </button>
            ))}
          </div>
          {article ? (
            <div className="mt-6 rounded-lg bg-white/80 p-5">
              <h3 className="text-xl font-semibold text-stone-950">{article.title}</h3>
              <p className="mt-2 leading-7 text-stone-700">{article.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded bg-amber-100 px-2 py-1 text-xs text-stone-700">
                    #{tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/posts/${article.slug}`}
                className="mt-5 inline-block rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-amber-50"
              >
                打开完整文章
              </Link>
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
