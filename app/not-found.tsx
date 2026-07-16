import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-950">404</h1>
        <p className="mt-3 text-stone-700">没有找到这篇文章或页面。</p>
        <Link className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-amber-50" href="/">
          返回首页
        </Link>
      </div>
    </main>
  );
}
