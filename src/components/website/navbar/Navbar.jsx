import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu } from "lucide-react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    // Only run intersection observer scroll spy on the homepage
    if (location.pathname !== "/") {
      return;
    }

    const sectionIds = [
      "home",
      "about",
      "treatments",
      "doctors",
      "before-after",
      "gallery",
      "testimonials",
      "blogs",
      "contact",
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px", // triggers when section dominates middle of screen
      threshold: 0,
    };

    const observedElements = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          transition-all
          duration-500
          ${
            isScrolled || location.pathname !== "/"
              ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm"
              : "bg-transparent"
          }
        `}
      >
        {/* Desktop Navbar */}

        <div
          className="
            mx-auto
            hidden
            h-[88px]
            max-w-[1280px]
            grid-cols-[300px_1fr_220px]
            items-center
            px-6
            lg:grid
          "
        >
          {/* Logo */}

          <div className="flex justify-start">
            <Logo />
          </div>

          {/* Navigation */}

          <div className="flex justify-center -translate-x-6">
            <NavLinks activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>

          {/* CTA */}

          <div className="flex justify-end">
            <a
              href="tel:+918309479901"
              aria-label="Call Now"
              className="
                group
                inline-flex
                h-12
                items-center
                gap-2
                rounded-xl
                bg-secondary
                px-6
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-green-500/25
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-secondary-dark
                hover:shadow-xl
                hover:shadow-green-500/30
                focus:outline-none
                focus:ring-4
                focus:ring-green-200
                cursor-pointer
              "
            >
              <span>Call Now</span>

              <Phone className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>
        </div>

        {/* Mobile Navbar */}

        <div
          className="
            flex
            h-[72px]
            items-center
            justify-between
            px-5
            lg:hidden
          "
        >
          <Logo />

          <div className="flex items-center gap-3">
            {/* Call Now */}

            <a
              href="tel:+918309479901"
              aria-label="Call Now"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-secondary
                text-white
                shadow-md
                transition-all
                duration-300
                hover:scale-105
                hover:bg-secondary-dark
                active:scale-95
                cursor-pointer
              "
            >
              <Phone size={20} />
            </a>

            {/* Menu */}

            <button
              type="button"
              aria-label="Open Menu"
              onClick={() => setIsMenuOpen(true)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-white
                text-primary
                transition-all
                duration-300
                hover:bg-slate-50
                active:scale-95
              "
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </>
  );
}

export default Navbar;