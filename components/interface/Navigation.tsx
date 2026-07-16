import Link from "next/link";
import { Compass, Home, Library, Map } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/40 bg-amber-50/85 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-900">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-700 text-amber-50">
            <Home size={18} />
          </span>
          <span>bzmxs.cn</span>
        </Link>
        <div className="flex items-center gap-1 rounded-lg bg-white/65 p-1 text-sm shadow-sm">
          <Link className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-amber-100" href="/explore">
            <Compass size={16} />
            探索
          </Link>
          <Link className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-amber-100" href="/reading">
            <Library size={16} />
            阅读
          </Link>
          <Link className="hidden items-center gap-1 rounded-md px-3 py-2 hover:bg-amber-100 sm:flex" href="/#map">
            <Map size={16} />
            地图
          </Link>
        </div>
      </div>
    </nav>
  );
}
