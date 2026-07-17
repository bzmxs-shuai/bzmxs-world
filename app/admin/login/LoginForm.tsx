"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-stone-700">
        用户名
        <input
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950"
          name="username"
          autoComplete="username"
          required
        />
      </label>
      <label className="block text-sm font-medium text-stone-700">
        密码
        <input
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        className="w-full rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
