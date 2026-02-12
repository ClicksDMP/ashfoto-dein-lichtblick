import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Disable browser's automatic scroll restoration
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top immediately on route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Also scroll after paint to beat any async layout shifts
  useEffect(() => {
    // First rAF to wait for render
    const raf1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      // Second rAF to catch any post-render layout shifts
      const raf2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
      return () => cancelAnimationFrame(raf2);
    });

    // Final fallback with timeout for any late async operations
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
