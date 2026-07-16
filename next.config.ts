import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: [require.resolve("./scripts/glsl-include-loader.cjs")],
    });

    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/work/**", "**/outputs/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
