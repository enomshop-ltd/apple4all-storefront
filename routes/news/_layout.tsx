import { define } from "../../lib/utils.ts";
import { NewsPost } from "../../lib/news.ts";

export default define.page(function NewsLayout({ Component, state, url }) {
  const posts = state.posts as NewsPost[] || [];
  
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Menu */}
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Latest News</h2>
          <ul class="space-y-3">
            <li>
              <a 
                href="/news" 
                class={`block text-sm transition-colors ${url.pathname === "/news" ? "text-slate-900 font-semibold" : "text-gray-600 hover:text-slate-900"}`}
              >
                News Home
              </a>
            </li>
            {posts.map((post) => {
              const isActive = url.pathname === `/news/${post.slug}`;
              return (
                <li key={post.slug}>
                  <a 
                    href={`/news/${post.slug}`} 
                    class={`block text-sm transition-colors ${isActive ? "text-slate-900 font-semibold" : "text-gray-600 hover:text-slate-900"}`}
                  >
                    {post.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 w-full min-w-0">
        <Component />
      </main>
    </div>
  );
});
