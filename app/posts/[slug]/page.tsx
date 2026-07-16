import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/interface/Navigation";
import { MDXContent } from "@/components/blog/MDXContent";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} | bzmxs.cn`,
    description: post.description,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <Navigation />
      <article className="reading-prose mx-auto max-w-3xl rounded-lg border border-amber-200 bg-amber-50/90 p-6 shadow-sm md:p-10">
        <div className="mb-8">
          <Link href="/reading" className="text-sm font-medium text-emerald-800 hover:text-emerald-950">
            返回普通阅读模式
          </Link>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-950">{post.title}</h1>
          <p className="mt-4 leading-7 text-stone-600">{post.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-stone-600">
            <span className="rounded bg-emerald-100 px-2.5 py-1 text-emerald-900">{post.category}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded bg-white px-2.5 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <MDXContent source={post.content} />
      </article>
    </main>
  );
}
