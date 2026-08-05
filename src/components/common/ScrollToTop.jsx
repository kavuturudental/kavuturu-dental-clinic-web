import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return;
      }
    }

    const params = new URLSearchParams(search);
    if (!params.has("section")) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
