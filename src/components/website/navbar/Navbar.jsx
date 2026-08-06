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
        className="
          fixed
          top-3 sm:top-4
          inset-x-0
          z-50
          px-4 sm:px-6 lg:px-8
          transition-all
          duration-300
          pointer-events-none
        "
      >
        <div
          className={`
            mx-auto
            max-w-[1280px]
            w-full
            rounded-2xl md:rounded-[24px]
            border
            transition-all
            duration-500
            pointer-events-auto
            ${
              isScrolled || location.pathname !== "/"
                ? "bg-white/95 backdrop-blur-xl border-gray-200/90 shadow-[0_10px_35px_rgba(14,42,109,0.12)]"
                : "bg-white/90 backdrop-blur-md border-white/50 shadow-[0_8px_30px_rgba(14,42,109,0.08)]"
            }
          `}
        >
          {/* Desktop Navbar Grid */}
          <div
            className="
              hidden
              h-[76px]
              grid-cols-[260px_1fr_200px]
              items-center
              px-6 lg:px-8
              lg:grid
            "
          >
            {/* Logo */}
            <div className="flex justify-start">
              <Logo />
            </div>

            {/* Navigation Links */}
            <div className="flex justify-center">
              <NavLinks activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>

            {/* CTA Button */}
            <div className="flex justify-end">
              <a
                href="tel:+918309479901"
                aria-label="Call Now"
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-secondary
                  px-5.5
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-green-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-secondary-dark
                  hover:shadow-lg
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

          {/* Mobile Navbar Row */}
          <div
            className="
              flex
              h-[64px]
              items-center
              justify-between
              px-4
              lg:hidden
            "
          >
            <Logo />

            <div className="flex items-center gap-2.5">
              {/* Call Now */}
              <a
                href="tel:+918309479901"
                aria-label="Call Now"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-secondary
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-secondary-dark
                  active:scale-95
                  cursor-pointer
                "
              >
                <Phone size={18} />
              </a>

              {/* Menu Button */}
              <button
                type="button"
                aria-label="Open Menu"
                onClick={() => setIsMenuOpen(true)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-800
                  transition-all
                  duration-300
                  hover:bg-slate-50
                  active:scale-95
                "
              >
                <Menu size={22} />
              </button>
            </div>
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