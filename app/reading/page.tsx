import Link from "next/link";
import { Navigation } from "@/components/interface/Navigation";
import { ArticleList } from "@/components/blog/ArticleList";
import { getAllPosts, getAreasWithCounts } from "@/lib/posts";

export default function ReadingPage() {
  const posts = getAllPosts();
  const counts = getAreasWithCounts();

  return (
    <main className="min-h-screen px-4 pb-16 pt-28">
      <Navigation />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-lg border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
          <p className="font-medium text-emerald-800">普通阅读模式</p>
          <h1 className="mt-2 text-4xl font-semibold text-stone-950">不加载 3D 场景的文章入口</h1>
          <p className="mt-4 max-w-3xl leading-7 text-stone-700">
            这里用于快速阅读、搜索和分类浏览。第一版先提供稳定文章列表，后续可以继续加入搜索、归档和旧博客迁移。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded bg-emerald-100 px-3 py-2 text-emerald-900">图书馆 {counts.library}</span>
            <span className="rounded bg-orange-100 px-3 py-2 text-orange-900">
              训练场 {counts["training-ground"]}
            </span>
            <span className="rounded bg-amber-100 px-3 py-2 text-amber-900">小房子 {counts.home}</span>
          </div>
        </header>
        <ArticleList posts={posts} />
        <div className="mt-10">
          <Link href="/" className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-amber-50">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
