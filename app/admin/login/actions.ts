"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "用户名或密码错误" };
  }

  try {
    const user = await verifyAdminCredentials(username, password);
    if (!user) {
      return { error: "用户名或密码错误" };
    }

    await createAdminSession(user);
  } catch {
    return { error: "后台尚未配置完成，请检查数据库和 AUTH_SECRET" };
  }

  redirect("/admin");
}
