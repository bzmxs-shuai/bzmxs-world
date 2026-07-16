import Link from "next/link";

export function WebGLFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div className="max-w-lg rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-950">当前浏览器无法加载 3D 小世界</h1>
        <p className="mt-3 leading-7 text-stone-700">
          WebGL 不可用时，仍然可以使用普通阅读模式查看所有示例文章。
        </p>
        <Link className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-3 text-amber-50" href="/reading">
          进入普通阅读模式
        </Link>
      </div>
    </div>
  );
}
