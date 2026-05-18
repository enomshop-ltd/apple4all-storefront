import { useEffect, useState } from "preact/hooks";

export default function TopProgressBarIsland() {
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
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + (90 - prev) * 0.1;
        });
      }, 200);
    };

    const completeProgress = () => {
      console.debug("[TopProgressBarIsland] Client navigation completed.");
      if (interval) clearInterval(interval);
      setProgress(100);

      timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setProgress(0), 300); // reset after fade out
      }, 500);
    };

    const errorProgress = () => {
      console.error("[TopProgressBarIsland] Client navigation error.");
      if (interval) clearInterval(interval);
      setProgress(100);

      timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setProgress(0), 300);
      }, 500);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        const url = new URL(anchor.href, globalThis.location.href);
        // Only trigger for same-origin, non-hash navigation, non-download, non-target-blank
        if (
          url.origin === globalThis.location.origin &&
          !anchor.hasAttribute("download") &&
          anchor.target !== "_blank" &&
          url.pathname + url.search !== globalThis.location.pathname + globalThis.location.search
        ) {
           // Wait a very short tick to see if default is prevented (e.g., standard JS click handler)
           setTimeout(() => {
             if (!e.defaultPrevented) {
               startProgress();
               // Fallback: IF it never completes, hide it after 10 seconds.
               if (timeout) clearTimeout(timeout);
               timeout = setTimeout(() => {
                 completeProgress();
               }, 10000);
             }
           }, 10);
        }
      }
    };

    const handleFormSubmit = (e: Event) => {
      setTimeout(() => {
        if (!e.defaultPrevented) {
          startProgress();
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            completeProgress();
          }, 10000);
        }
      }, 10);
    };

    // Adding listener for Fresh client side routing events.
    globalThis.addEventListener("fresh:render", startProgress);
    globalThis.addEventListener("fresh:rendered", completeProgress);
    globalThis.addEventListener("fresh:partial-start", startProgress);
    globalThis.addEventListener("fresh:partial-end", completeProgress);
    globalThis.addEventListener("fresh:client-nav-start", startProgress);
    globalThis.addEventListener("fresh:client-nav-end", completeProgress);
    globalThis.addEventListener("click", handleAnchorClick);
    globalThis.addEventListener("submit", handleFormSubmit);
    globalThis.addEventListener("popstate", completeProgress);

    // In some builds, custom events trigger, so we capture these if people implement standard router custom events:
    globalThis.addEventListener("router:start", startProgress);
    globalThis.addEventListener("router:done", completeProgress);
    globalThis.addEventListener("router:error", errorProgress);

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
      globalThis.removeEventListener("fresh:render", startProgress);
      globalThis.removeEventListener("fresh:rendered", completeProgress);
      globalThis.removeEventListener("fresh:partial-start", startProgress);
      globalThis.removeEventListener("fresh:partial-end", completeProgress);
      globalThis.removeEventListener("fresh:client-nav-start", startProgress);
      globalThis.removeEventListener("fresh:client-nav-end", completeProgress);
      globalThis.removeEventListener("click", handleAnchorClick);
      globalThis.removeEventListener("submit", handleFormSubmit);
      globalThis.removeEventListener("popstate", completeProgress);
      globalThis.removeEventListener("router:start", startProgress);
      globalThis.removeEventListener("router:done", completeProgress);
      globalThis.removeEventListener("router:error", errorProgress);
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
