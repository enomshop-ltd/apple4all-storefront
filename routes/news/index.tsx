import { define } from "../../lib/utils.ts";
import { Head } from "fresh/runtime";
import { NewsPost } from "../../lib/news.ts";

export default define.page(function NewsIndex({ state }) {
  const posts = state.posts as NewsPost[] || [];
  const featured = posts[0];
  const restPosts = posts.slice(1);

  return (
    <div class="min-h-screen text-slate-900 font-sans">
      <Head>
        <title>Stories & News | Tech Store</title>
        <meta name="description" content="Editorial news and stories from your favorite tech store." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Stories & News | Tech Store" />
        <meta property="og:description" content="Editorial news and stories from your favorite tech store." />
        {featured?.image && <meta property="og:image" content={featured.image} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stories & News | Tech Store" />
        <meta name="twitter:description" content="Editorial news and stories from your favorite tech store." />
        {featured?.image && <meta name="twitter:image" content={featured.image} />}
      </Head>

      <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        
        {/* Full Width Hero: STORIES */}
        <div class="flex flex-col md:flex-row gap-8 mb-20">
          <div class="md:w-1/4 lg:w-1/3 shrink-0">
            <h1 class="font-[Oswald] text-[100px] md:text-[180px] lg:text-[240px] leading-[0.85] uppercase tracking-tighter text-[#1a1a1a]">
              Sto<br/>ries
            </h1>
          </div>
          
          <div class="md:w-3/4 lg:w-2/3 flex-1">
            {featured && (
              <a href={`/news/${featured.slug}`} class="group block w-full">
                <div class="relative w-full aspect-[16/9] md:aspect-[21/9] mb-6 overflow-hidden bg-slate-100 rounded-sm">
                  <img 
                    src={featured.image || "https://images.unsplash.com/photo-1531297172864-45d0609bcfcb?auto=format&fit=crop&q=80&w=1200"} 
                    alt={featured.title}
                    class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div class="flex items-center gap-4 text-xs font-semibold tracking-widest uppercase mb-3 text-slate-500">
                  <span class="border border-slate-300 px-2 py-1">{featured.category || 'NEWS'}</span>
                  <time>{new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                </div>
                <h2 class="text-4xl md:text-6xl font-[Oswald] uppercase leading-none mb-4 group-hover:text-orange-700 transition-colors">
                  {featured.title}
                </h2>
                <p class="text-slate-600 font-serif italic text-xl mb-6 max-w-3xl">
                  {featured.snippet}
                </p>
                <div class="text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span class="w-8 h-[1px] bg-black"></span>
                  Read full story
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Remaining Posts Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-t border-slate-200 pt-16">
          {restPosts.map((post) => (
            <a href={`/news/${post.slug}`} key={post.slug} class="group block">
              <div class="relative w-full aspect-[4/3] mb-6 overflow-hidden bg-slate-100 rounded-sm">
                <img 
                  src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} 
                  alt={post.title}
                  class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div class="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase mb-3 text-slate-500">
                <span class="border border-slate-200 px-2 py-1">{post.category || 'NEWS'}</span>
                <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <h3 class="text-2xl font-[Oswald] uppercase leading-tight mb-3 group-hover:text-orange-700 transition-colors">
                {post.title}
              </h3>
              <p class="text-slate-600 font-serif italic line-clamp-3">
                {post.snippet}
              </p>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
});
