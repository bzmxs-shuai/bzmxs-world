import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import { getAdminSession } from "@/lib/admin/auth";
import { logoutAction } from "./logout/actions";

export const metadata: Metadata = {
  title: "Admin | BZMXS World",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const posts = getAllPosts({ includeDrafts: true });
  const published = posts.filter((post) => !post.draft).length;
  const drafts = posts.filter((post) => post.draft).length;
  const areas = {
    library: posts.filter((post) => post.area === "library").length,
    "training-ground": posts.filter((post) => post.area === "training-ground").length,
    home: posts.filter((post) => post.area === "home").length,
  };

  return (
    <main className="min-h-screen bg-stone-100 p-6 text-stone-950">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">BZMXS WORLD CMS</p>
            <h1 className="mt-1 text-3xl font-semibold">仪表盘</h1>
          </div>
          <form action={logoutAction}>
            <button className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">登出</button>
          </form>
        </header>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-500">已发布</p>
            <strong className="mt-2 block text-3xl">{published}</strong>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-500">草稿</p>
            <strong className="mt-2 block text-3xl">{drafts}</strong>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-500">文章总数</p>
            <strong className="mt-2 block text-3xl">{posts.length}</strong>
          </div>
        </section>

        <section className="mt-6 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">区域文章</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {Object.entries(areas).map(([area, count]) => (
              <div key={area} className="rounded border border-stone-200 p-3">
                <p className="text-sm text-stone-500">{area}</p>
                <strong className="text-2xl">{count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-md bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">最近文章</h2>
            <Link className="text-sm font-semibold text-stone-700 underline" href="/reading">
              查看公开阅读模式
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-stone-200">
            {posts.slice(0, 8).map((post) => (
              <li key={post.slug} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-stone-500">
                    {post.area} / {post.category}
                  </p>
                </div>
                <Link className="text-sm underline" href={`/posts/${post.slug}`}>
                  预览
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
