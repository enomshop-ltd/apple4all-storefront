import { extract } from "@std/front-matter/any";
import { marked } from "marked";

export interface NewsPost {
  slug: string;
  title: string;
  date: Date;
  snippet: string;
  content: string;
  views: number;
}

const kv = await Deno.openKv();

export async function getPosts(): Promise<NewsPost[]> {
  const posts: NewsPost[] = [];
  try {
    for await (const dirEntry of Deno.readDir("./news")) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        const slug = dirEntry.name.replace(".md", "");
        const post = await getPost(slug);
        if (post) {
          posts.push(post);
        }
      }
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
  
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

export async function getPost(slug: string): Promise<NewsPost | null> {
  try {
    const text = await Deno.readTextFile(`./news/${slug}.md`);
    const { attrs, body } = extract<{ title: string; date: string; snippet: string }>(text);
    
    // Convert markdown body to HTML string
    const content = await marked.parse(body);
    
    // Get view count from Deno KV
    const viewsRes = await kv.get<number>(["news_views", slug]);
    const views = viewsRes.value || 0;

    return {
      slug,
      title: attrs.title || "Untitled",
      date: new Date(attrs.date || Date.now()),
      snippet: attrs.snippet || "",
      content,
      views,
    };
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return null;
    }
    throw err;
  }
}

export async function incrementViews(slug: string): Promise<void> {
  const key = ["news_views", slug];
  const res = await kv.get<number>(key);
  const currentViews = res.value || 0;
  await kv.set(key, currentViews + 1);
}
