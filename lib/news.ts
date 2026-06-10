import { extract } from "@std/front-matter/any";
import { marked } from "marked";

export interface NewsPost {
  slug: string;
  title: string;
  date: Date;
  snippet: string;
  content: string;
  views: number;
  image?: string;
  category?: string;
}

// We use an in-memory cache for the frontmatter metadata.
// Since markdown files are static assets deployed with the app, 
// they don't change without a deployment, making memory cache safe and extremely fast.
let metadataCache: Omit<NewsPost, 'content' | 'views'>[] | null = null;

let kvInstance: Deno.Kv | undefined;

async function getKv(): Promise<Deno.Kv> {
  if (!kvInstance) {
    // Use a specific file path to ensure the DB persists across 
    // different entrypoints (e.g. Vite dev server vs production server)
    kvInstance = await Deno.openKv(Deno.env.get("DENO_DEPLOYMENT_ID") ? undefined : "./news_views.db");
  }
  return kvInstance;
}

// Optimized function to read just the frontmatter of a single file
async function getPostMetadata(slug: string): Promise<Omit<NewsPost, 'content' | 'views'> | null> {
  try {
    const text = await Deno.readTextFile(`./news/${slug}.md`);
    const { attrs } = extract<{ title: string; date: string; snippet: string; image?: string; category?: string; }>(text);
    
    return {
      slug,
      title: attrs.title || "Untitled",
      date: new Date(attrs.date || Date.now()),
      snippet: attrs.snippet || "",
      image: attrs.image,
      category: attrs.category ? attrs.category.toUpperCase() : "NEWS",
    };
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return null;
    }
    throw err;
  }
}

export async function getPosts(): Promise<Omit<NewsPost, 'content' | 'views'>[]> {
  // Return from memory cache instantly if available (O(1) time)
  // In local dev, you might want to comment out the cache check if you are actively editing files.
  if (metadataCache && Deno.env.get("DENO_DEPLOYMENT_ID")) {
    return metadataCache;
  }

  const slugs: string[] = [];
  try {
    for await (const dirEntry of Deno.readDir("./news")) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        slugs.push(dirEntry.name.replace(".md", ""));
      }
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
  
  // Read and parse all files concurrently, which is vastly faster than sequential awaits
  const metadataPromises = slugs.map(slug => getPostMetadata(slug));
  const results = await Promise.all(metadataPromises);
  
  const posts = results.filter((p): p is Omit<NewsPost, 'content' | 'views'> => p !== null);
  
  // Sort newest first
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Save to cache
  metadataCache = posts;
  
  return posts;
}

export async function getPost(slug: string): Promise<NewsPost | null> {
  try {
    // 1. Read the full file
    const text = await Deno.readTextFile(`./news/${slug}.md`);
    const { attrs, body } = extract<{ title: string; date: string; snippet: string; image?: string; category?: string; }>(text);
    
    // 2. Parse Markdown ONLY when viewing the individual article
    const content = await marked.parse(body);
    
    // 3. Fetch live views from KV ONLY for the individual article
    const kv = await getKv();
    const viewsRes = await kv.get<number>(["news_views", slug]);
    const views = viewsRes.value || 0;

    return {
      slug,
      title: attrs.title || "Untitled",
      date: new Date(attrs.date || Date.now()),
      snippet: attrs.snippet || "",
      content,
      views,
      image: attrs.image,
      category: attrs.category ? attrs.category.toUpperCase() : "NEWS",
    };
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return null;
    }
    throw err;
  }
}

export async function incrementViews(slug: string): Promise<void> {
  const kv = await getKv();
  const key = ["news_views", slug];
  const res = await kv.get<number>(key);
  const currentViews = res.value || 0;
  await kv.set(key, currentViews + 1);
}
