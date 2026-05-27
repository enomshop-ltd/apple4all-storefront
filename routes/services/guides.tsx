import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { BookOpen, ExternalLink, AlertTriangle } from "lucide-preact";
import { STORE_NAME } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `DIY Repair Guides - ${STORE_NAME}`;
    ctx.state.description = "Free Apple repair guides powered by iFixit.";
    
    // We statically define these as the iFixit categories API for specific devices 
    // does not output a simple child array anymore.
    const macGuides = [
      { name: "MacBook Pro 13\"", image: "https://valkyrie.cdn.ifixit.com/media/2021/04/13010531/MacBook_Pro_13_inch.jpg" },
      { name: "MacBook Pro 14\"", image: "https://valkyrie.cdn.ifixit.com/media/2021/11/02123517/Macbook_Pro_14_Inch.jpg" },
      { name: "MacBook Pro 16\"", image: "https://valkyrie.cdn.ifixit.com/media/2020/09/24102927/MacBook_Pro_16.jpg" },
      { name: "MacBook Air 13\"", image: "https://valkyrie.cdn.ifixit.com/media/2020/09/24102925/MacBook_Air_13.jpg" },
      { name: "iMac", image: "https://valkyrie.cdn.ifixit.com/media/2021/05/21151624/iMac_24-Inch.jpg" },
      { name: "Mac mini", image: "https://valkyrie.cdn.ifixit.com/media/2020/09/24102924/Mac_Mini.jpg" }
    ];
    
    const iphoneGuides = [
      { name: "iPhone 15 Pro Max", image: "https://valkyrie.cdn.ifixit.com/media/2023/10/02141505/iPhone-15-Pro-Max.jpg" },
      { name: "iPhone 15 Pro", image: "https://valkyrie.cdn.ifixit.com/media/2023/10/02141512/iPhone-15-Pro.jpg" },
      { name: "iPhone 15", image: "https://valkyrie.cdn.ifixit.com/media/2023/10/02141520/iPhone-15.jpg" },
      { name: "iPhone 14 Pro Max", image: "https://valkyrie.cdn.ifixit.com/media/2022/09/20120023/iPhone_14_Pro_Max.jpg" },
      { name: "iPhone 14 Pro", image: "https://valkyrie.cdn.ifixit.com/media/2022/09/20120125/iPhone_14_Pro.jpg" },
      { name: "iPhone 13", image: "https://valkyrie.cdn.ifixit.com/media/2021/10/04113224/iPhone_13.jpg" }
    ];
    
    return page({ macGuides, iphoneGuides });
  },
});

export default define.page(function GuidesPage({ state, data }) {
  const { macGuides, iphoneGuides } = data;

  return (
    <div class="max-w-6xl mx-auto px-4 py-12">
      <Head>
        <title>{state.title as string}</title>
        <meta name="description" content={state.description as string} />
      </Head>

      <div class="text-center mb-16 space-y-4">
        <div class="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
          <BookOpen class="w-8 h-8" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          DIY Repair Guides
        </h1>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-light">
          We believe in your right to repair. If you're feeling adventurous, here are free, open-source repair guides powered by the amazing team at iFixit.
        </p>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex items-start gap-4 max-w-4xl mx-auto text-amber-800">
        <AlertTriangle class="w-6 h-6 shrink-0 mt-0.5 text-amber-600" />
        <div class="text-sm leading-relaxed">
          <h4 class="font-bold mb-1 text-amber-900">Legal & Licensing Disclaimer</h4>
          <p>
            Due to Creative Commons Non-Commercial (CC BY-NC-SA) licensing, we cannot host or copy these guides directly on our commercial store. 
            However, we fully support the DIY community! The links below will take you directly to official iFixit.com guides where you can learn safely. 
            We are not affiliated with iFixit. 
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Mac Guides */}
        <div>
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <span class="text-3xl">💻</span> Mac Repair Guides
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {macGuides.length > 0 ? macGuides.map((guide: any) => (
              <a
                href={`https://www.ifixit.com/Device/${encodeURIComponent(guide.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center gap-3">
                  {guide.image?.thumbnail && (
                    <img src={guide.image.thumbnail} alt={guide.name} class="w-10 h-10 object-contain" />
                  )}
                  <span class="font-medium text-gray-700 group-hover:text-blue-600">
                    {guide.name}
                  </span>
                </div>
                <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
              </a>
            )) : (
              <p class="text-gray-500">Temporarily unavailable. Please visit iFixit.com directly.</p>
            )}
          </div>
        </div>

        {/* iPhone Guides */}
        <div>
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <span class="text-3xl">📱</span> iPhone Repair Guides
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {iphoneGuides.length > 0 ? iphoneGuides.map((guide: any) => (
              <a
                href={`https://www.ifixit.com/Device/${encodeURIComponent(guide.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center gap-3">
                  {guide.image?.thumbnail && (
                    <img src={guide.image.thumbnail} alt={guide.name} class="w-10 h-10 object-contain" />
                  )}
                  <span class="font-medium text-gray-700 group-hover:text-blue-600">
                    {guide.name}
                  </span>
                </div>
                <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
              </a>
            )) : (
              <p class="text-gray-500">Temporarily unavailable. Please visit iFixit.com directly.</p>
            )}
          </div>
        </div>
      </div>
      
      <div class="mt-16 text-center">
        <a 
          href="/services/repairs" 
          f-client-nav
          class="inline-flex items-center justify-center p-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Too complicated? Book a Professional Repair Instead
        </a>
      </div>
    </div>
  );
});
