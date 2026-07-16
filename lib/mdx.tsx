import { MDXRemote } from "next-mdx-remote/rsc";
import type { HTMLAttributes } from "react";
import remarkGfm from "remark-gfm";

type MDXContentProps = {
  source: string;
};

const components = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-2xl font-semibold text-stone-900" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-xl font-semibold text-stone-900" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-5 leading-8 text-stone-700" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-stone-700" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-stone-700" {...props} />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm text-stone-900" {...props} />
  ),
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-stone-950 p-4 text-sm leading-6 text-stone-100"
      {...props}
    />
  ),
};

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />;
}
