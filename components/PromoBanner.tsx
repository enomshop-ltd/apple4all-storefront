export function PromoBanner() {
  return (
    <div class="flex flex-col md:flex-row bg-slate-900 rounded-2xl overflow-hidden shadow-lg w-full text-white transform hover:scale-[1.01] transition-transform duration-300">
      <div class="md:w-5/12 relative overflow-hidden min-h-[200px] flex items-center justify-center bg-black">
        {/* Abstract background */}
        <div class="absolute inset-0 opacity-40">
          <div class="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-black animate-pulse" />
        </div>
        {/* Repair Illustration */}
        <div class="relative z-10 w-full h-full p-4 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800"
            alt="Device Repair"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover rounded-xl shadow-2xl opacity-90"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Overlay gradient */}
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90 md:block hidden" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent md:hidden block" />
      </div>
      
      <div class="md:w-7/12 p-6 md:p-8 flex flex-col justify-center relative z-20">
        <div class="flex flex-col h-full justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-blue-200 mb-4 backdrop-blur-sm border border-white/10">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute" />
              <span class="w-2 h-2 rounded-full bg-blue-400 relative" />
              Expert Repair Services
            </div>
            
            <h2 class="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
              Bring your device back to life
            </h2>
            
            <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-medium italic">
              "Our prices are lower than your expectations."
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/repairs/book"
              f-client-nav
              class="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              Book a Repair Now
            </a>
            
            <a
              href="/services/repairs"
              f-client-nav
              class="w-full sm:w-auto px-6 py-3 bg-transparent text-white border border-white/20 font-medium rounded-lg hover:bg-white/10 transition-colors text-center text-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
