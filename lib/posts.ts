import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogArea = "library" | "training-ground" | "home" | "laboratory" | "museum";

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  description: string;
  area: BlogArea;
  category: string;
  tags: string[];
  legacyUrl?: string;
  draft: boolean;
  difficulty?: "入门" | "普及-" | "普及/提高-" | "提高";
  problemId?: string;
};

export type Post = PostMeta & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

function isPostMeta(value: unknown): value is PostMeta {
  const item = value as Partial<PostMeta>;
  return Boolean(
    item.title &&
      item.slug &&
      item.date &&
      item.description &&
      item.area &&
      item.category &&
      Array.isArray(item.tags) &&
      typeof item.draft === "boolean",
  );
}

export function getAllPosts({ includeDrafts = false } = {}): Post[] {
  const filenames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));

  return filenames
    .map((filename) => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      if (!isPostMeta(data)) {
        throw new Error(`Invalid frontmatter in ${filename}`);
      }

      return { ...data, content };
    })
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts({ includeDrafts: false }).find((post) => post.slug === slug);
}

export function getPostsByArea(area: BlogArea): Post[] {
  return getAllPosts().filter((post) => post.area === area);
}

export function getAreasWithCounts() {
  return getAllPosts().reduce<Record<BlogArea, number>>(
    (counts, post) => {
      counts[post.area] += 1;
      return counts;
    },
    { library: 0, "training-ground": 0, home: 0, laboratory: 0, museum: 0 },
  );
}

export function getAllSlugs() {
  return getAllPosts({ includeDrafts: false }).map((post) => post.slug);
}
