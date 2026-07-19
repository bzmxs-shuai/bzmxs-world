import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | BZMXS World",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 text-stone-950">
      <section className="mx-auto max-w-sm rounded-md bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">BZMXS WORLD</p>
        <h1 className="mt-2 text-2xl font-semibold">管理端登录</h1>
        <p className="mt-2 text-sm text-stone-600">使用服务器端账号登录。密码不会进入客户端源码。</p>
        <LoginForm />
      </section>
    </main>
  );
}
