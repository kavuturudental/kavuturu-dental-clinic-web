import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, inView]. `inView` flips to true the first time the element
 * comes within `rootMargin` of the viewport and then stays true.
 *
 * Used to defer below-the-fold API calls and animations so they don't
 * compete with the initial page load.
 */
export default function useInViewOnce(rootMargin = "300px 0px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;

    const el = ref.current;

    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
