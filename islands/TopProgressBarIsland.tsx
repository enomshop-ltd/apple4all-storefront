import { useEffect, useState } from "preact/hooks";

function ProgressBarInner() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: number | null = null;
    let interval: number | null = null;

    const startProgress = () => {
      console.debug("[TopProgressBarIsland] Client navigation started.");
      setVisible(true);
      setProgress(15);

      if (interval) clearInterval(interval);
      interval = globalThis.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + (90 - prev) * 0.15;
        });
      }, 200);
    };

    const completeProgress = () => {
      console.debug("[TopProgressBarIsland] Client navigation completed.");
      if (interval) clearInterval(interval);
      setProgress(100);

      if (timeout) clearTimeout(timeout);
      timeout = globalThis.setTimeout(() => {
        setVisible(false);
        globalThis.setTimeout(() => setProgress(0), 300); // reset after fade out
      }, 400);
    };

    const errorProgress = () => {
      console.error("[TopProgressBarIsland] Client navigation error.");
      if (interval) clearInterval(interval);
      setProgress(100); // Optional: turn red here

      if (timeout) clearTimeout(timeout);
      timeout = globalThis.setTimeout(() => {
        setVisible(false);
        globalThis.setTimeout(() => setProgress(0), 300);
      }, 400);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href, globalThis.location.href);
          // Only trigger for same-origin, non-hash navigation, non-download, non-target-blank
          if (
            url.origin === globalThis.location.origin &&
            !anchor.hasAttribute("download") &&
            anchor.target !== "_blank" &&
            (url.pathname !== globalThis.location.pathname || url.search !== globalThis.location.search)
          ) {
            // Fresh intercepts clicks and calls e.preventDefault() so we can't rely on !e.defaultPrevented
            // We'll just assume any internal link click might trigger navigation:
            startProgress();
            
            // Fallback timeout in case navigation gets cancelled or fails silently
            if (timeout) clearTimeout(timeout);
            timeout = globalThis.setTimeout(() => {
              completeProgress();
            }, 10000);
          }
        } catch (err) {
          // Ignore parsing errors
        }
      }
    };

    const handleFormSubmit = () => {
      startProgress();
      if (timeout) clearTimeout(timeout);
      timeout = globalThis.setTimeout(() => {
        completeProgress();
      }, 10000);
    };

    // Patch pushState and replaceState to detect when Fresh (or standard SPA router) changes URL
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      completeProgress();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      completeProgress();
      return originalReplaceState.apply(this, args);
    };

    // Intercept fetch for background loading of HTML (classic Fresh partial behavior)
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async function (input, init) {
      // Very loose check to see if this might be a navigation fetch
      let isNav = false;
      try {
        if (init?.headers) {
          const headers = new Headers(init.headers);
          if (headers.get("accept")?.includes("text/html") || headers.has("x-fresh-action")) {
            isNav = true;
          }
        } else if (input instanceof Request) {
          if (input.headers.get("accept")?.includes("text/html") || input.headers.has("x-fresh-action")) {
            isNav = true;
          }
        } else if (typeof input === "string") {
          // Fresh v2 sometimes uses specific internal routes or headers, hard to detect.
          // The click interceptor handles most of it anyway.
        }
      } catch (err) { }

      if (isNav) startProgress();

      try {
        const response = await originalFetch.apply(this, [input, init] as any);
        if (isNav) completeProgress();
        return response;
      } catch (err) {
        if (isNav) errorProgress();
        throw err;
      }
    };

    // Listeners
    // Use capture: true for click so we catch it before Fresh intercepts it!
    globalThis.addEventListener("click", handleAnchorClick, { capture: true });
    globalThis.addEventListener("submit", handleFormSubmit, { capture: true });
    globalThis.addEventListener("popstate", completeProgress);

    // Fresh specific custom events (some versions/builds)
    globalThis.addEventListener("fresh:render", startProgress);
    globalThis.addEventListener("fresh:rendered", completeProgress);
    globalThis.addEventListener("fresh:partial-start", startProgress);
    globalThis.addEventListener("fresh:partial-end", completeProgress);
    globalThis.addEventListener("fresh:client-nav-start", startProgress);
    globalThis.addEventListener("fresh:client-nav-end", completeProgress);

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
      
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      globalThis.fetch = originalFetch;
      
      globalThis.removeEventListener("click", handleAnchorClick, { capture: true });
      globalThis.removeEventListener("submit", handleFormSubmit, { capture: true });
      globalThis.removeEventListener("popstate", completeProgress);
      
      globalThis.removeEventListener("fresh:render", startProgress);
      globalThis.removeEventListener("fresh:rendered", completeProgress);
      globalThis.removeEventListener("fresh:partial-start", startProgress);
      globalThis.removeEventListener("fresh:partial-end", completeProgress);
      globalThis.removeEventListener("fresh:client-nav-start", startProgress);
      globalThis.removeEventListener("fresh:client-nav-end", completeProgress);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "3px",
        backgroundColor: "#2563EB", // Tailwind blue-600
        zIndex: 9999,
        transition: visible ? "width 0.2s ease-out, opacity 0.1s ease-in" : "width 0s, opacity 0.3s ease-out",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
      }}
    />
  );
}

export default function TopProgressBarIsland() {
  if (typeof document === "undefined") {
    // Return an empty placeholder on the server to prevent hydration mismatch crashes,
    // while bypassing the Vite SSR Preact hook bug.
    return <div id="top-progress-bar-placeholder" />;
  }
  return <ProgressBarInner />;
}
