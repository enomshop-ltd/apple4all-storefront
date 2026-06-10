import { define } from "../../lib/utils.ts";
import { Head } from "fresh/runtime";
import { getPost, getPosts, incrementViews, NewsPost } from "../../lib/news.ts";

export default define.page(async function NewsPostPage(ctx) {
  const slug = ctx.params.slug;
  let post = await getPost(slug);
  const allPosts = await getPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Increment views for this post
  await incrementViews(slug);
  // Fetch updated post so the UI reflects the new view count immediately
  post = await getPost(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article class="min-h-screen text-slate-900 font-sans pb-24">
      <Head>
        <title>{post.title} | Tech Store News</title>
        <meta name="description" content={post.snippet} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.snippet} />
        {post.image && <meta property="og:image" content={post.image} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.snippet} />
        {post.image && <meta name="twitter:image" content={post.image} />}
      </Head>

      {/* Hero Header */}
      <header class="pt-16 pb-12 px-4 md:px-8 max-w-[1000px] mx-auto text-center">
        <div class="flex items-center justify-center gap-4 text-xs font-semibold tracking-widest uppercase mb-8 text-slate-500">
          <span class="text-slate-500 border border-slate-300 px-2 py-1">{post.category}</span>
          <time dateTime={post.date.toISOString()}>
            {post.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          <span>•</span>
          <span>{post.views} views</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl lg:text-[90px] font-[Oswald] uppercase leading-none tracking-tighter mb-8">
          {post.title}
        </h1>
        
        <p class="text-2xl md:text-3xl font-sans text-slate-600 max-w-[800px] mx-auto leading-relaxed">
          {post.snippet}
        </p>
      </header>

      {/* Hero Image */}
      <div class="w-full max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
        <div class="w-full aspect-video md:aspect-[21/9] overflow-hidden">
          <img 
            src={post.image || "https://images.unsplash.com/photo-1531297172864-45d0609bcfcb?auto=format&fit=crop&q=80&w=1600"} 
            alt={post.title}
            class="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Content */}
      <div class="px-4 md:px-8 max-w-[800px] mx-auto">
        <div 
          class="prose prose-slate prose-lg md:prose-xl max-w-none font-sans
                 prose-p:leading-relaxed prose-p:text-slate-700 
                 prose-headings:font-[Oswald] prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-slate-900
                 prose-a:text-orange-700 prose-a:no-underline hover:prose-a:underline
                 first-letter:text-7xl first-letter:font-[Oswald] first-letter:float-left first-letter:mr-3 first-letter:leading-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div class="mt-24 pt-16 border-t border-slate-200">
          <h3 class="font-[Oswald] text-3xl uppercase tracking-tight mb-8">Latest Stories</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(post => (
              <a href={`/news/${post.slug}`} class="group block">
                <div class="relative w-full aspect-video mb-4 overflow-hidden bg-slate-100 rounded-sm">
                  <img 
                    src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} 
                    alt={post.title}
                    class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div class="flex items-center gap-3 text-[10px] font-semibold tracking-widest uppercase mb-2 text-slate-500">
                  <span class="border border-slate-200 px-2 py-1">{post.category || 'NEWS'}</span>
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                </div>
                <h4 class="text-lg font-[Oswald] uppercase leading-tight mb-2 group-hover:text-orange-700 transition-colors">
                  {post.title}
                </h4>
              </a>
            ))}
          </div>
          
          <div class="mt-16 flex justify-center">
            <a href="/news" class="text-sm uppercase tracking-widest font-semibold flex items-center gap-2 group hover:text-orange-700 transition-colors">
              <span aria-hidden="true" class="rotate-180 inline-block">→</span>
              View all stories
            </a>
          </div>
        </div>
      </div>
    </article>
  );
});
