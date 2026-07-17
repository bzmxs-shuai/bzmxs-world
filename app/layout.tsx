import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "bzmxs.cn 3D Blog",
  description: "一个低多边形 3D 小世界个人博客 MVP。",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <script
          id="mutation-observer-target-guard"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const nativeObserve = window.MutationObserver?.prototype?.observe;
                if (!nativeObserve || window.__bzmxsMutationObserverGuard) return;
                window.__bzmxsMutationObserverGuard = true;
                window.MutationObserver.prototype.observe = function(target, options) {
                  if (!(target instanceof Node)) {
                    console.warn('[bzmxs] MutationObserver.observe ignored a non-Node target.', target);
                    return;
                  }
                  return nativeObserve.call(this, target, options);
                };
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
