import { define } from "../../lib/utils.ts";
import { Head } from "fresh/runtime";
import { getPost, incrementViews, NewsPost } from "../../lib/news.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const slug = ctx.params.slug;
    let post = await getPost(slug);
    
    if (!post) {
      return ctx.renderNotFound();
    }
    
    // Increment views for this post
    await incrementViews(slug);
    // Fetch updated post so the UI reflects the new view count immediately
    post = await getPost(slug);
    
    ctx.state.post = post;
    return ctx.render();
  }
});

export default define.page(function NewsPostPage({ state }) {
  const post = state.post as NewsPost | null;

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.snippet} />
      </Head>

      <header class="mb-10 text-center">
        <div class="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4">
          <time dateTime={post.date.toISOString()}>
            {post.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          <span>•</span>
          <span>{post.views} views</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          {post.title}
        </h1>
        <hr class="border-slate-100" />
      </header>

      <div 
        class="prose prose-slate prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
});
