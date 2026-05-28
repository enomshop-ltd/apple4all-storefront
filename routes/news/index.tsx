import { define } from "../../lib/utils.ts";
import { Head } from "fresh/runtime";
import { NewsPost } from "../../lib/news.ts";

export default define.page(function NewsIndex({ state }) {
  const posts = state.posts as NewsPost[] || [];

  return (
    <div>
      <Head>
        <title>Latest News</title>
        <meta name="description" content="Stay updated with the latest news, repair tips, and store announcements." />
      </Head>

      <div class="mb-12">
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Latest News</h1>
        <p class="text-lg text-slate-600">
          Stay updated with the latest news, repair tips, and store announcements from our team.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8">
        {posts.length === 0 ? (
          <p class="text-slate-500">No news articles found.</p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <time dateTime={post.date.toISOString()}>
                  {post.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span>•</span>
                <span>{post.views} views</span>
              </div>
              <h2 class="text-2xl font-bold text-slate-900 mb-3">
                <a href={`/news/${post.slug}`} class="hover:text-slate-700">
                  {post.title}
                </a>
              </h2>
              <p class="text-slate-600 mb-6 line-clamp-3">
                {post.snippet}
              </p>
              <a 
                href={`/news/${post.slug}`}
                class="inline-flex items-center text-sm font-medium text-slate-900 hover:text-slate-700"
              >
                Read more <span aria-hidden="true" class="ml-1">→</span>
              </a>
            </article>
          ))
        )}
      </div>
    </div>
  );
});
