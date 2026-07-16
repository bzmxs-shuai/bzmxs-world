"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-950">页面暂时迷路了</h1>
        <p className="mt-3 text-stone-700">可以重试当前页面，或回到首页继续探索。</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="rounded-lg bg-emerald-700 px-4 py-2 text-amber-50">
            重试
          </button>
          <Link href="/" className="rounded-lg bg-stone-900 px-4 py-2 text-amber-50">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
