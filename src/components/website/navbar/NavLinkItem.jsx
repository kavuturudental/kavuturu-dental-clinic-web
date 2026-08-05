// src/components/navbar/NavLinkItem.jsx

import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

function NavLinkItem({
  item,
  activeSection,
  setActiveSection,
  onClick,
  mobile = false,
}) {
  const location = useLocation();

  // Map item label to section ID
  const labelMap = {
    "Home": "home",
    "About": "about",
    "Treatments": "treatments",
    "Doctors": "doctors",
    "Testimonials": "before-after",
    "Blogs": "blogs",
    "Contact": "contact",
  };

  const targetSectionId = labelMap[item.label];

  const getIsActive = () => {
    if (location.pathname === "/") {
      return activeSection === targetSectionId;
    } else {
      if (item.href === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(item.href);
    }
  };

  const isLinkActive = getIsActive();

  const handleLinkClick = (event) => {
    if (item.href === "/") {
      if (location.pathname === "/") {
        event.preventDefault();
        const section = document.getElementById("home");
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setActiveSection?.("home");
        }
      }
      onClick?.(); // close mobile drawer
      return;
    }

    if (item.type === "section") {
      if (location.pathname === "/") {
        event.preventDefault();
        const section = document.getElementById(targetSectionId);
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setActiveSection?.(targetSectionId);
        }
      } else {
        event.preventDefault();
        window.location.href = `/${item.href}`;
      }
      onClick?.(); // close mobile drawer
      return;
    }

    // Default route links (About, Doctors, Gallery, Blogs, Treatments)
    onClick?.(); // close mobile drawer
  };

  return (
    <li className={mobile ? "" : "group"}>
      <NavLink
        to={item.href}
        onClick={handleLinkClick}
        aria-current={isLinkActive ? "page" : undefined}
        className={clsx(
          "relative font-medium transition-all duration-300",

          mobile
            ? "block rounded-xl px-4 py-4 text-lg hover:bg-slate-100"
            : "py-2 text-[15px]",

          isLinkActive
            ? "text-primary font-semibold"
            : "text-text-secondary hover:text-primary"
        )}
      >
        {item.label}

        {!mobile && (
          <span
            className={clsx(
              "absolute -bottom-1 left-0 h-[2px] rounded-full bg-secondary transition-all duration-300",
              isLinkActive
                ? "w-full"
                : "w-0 group-hover:w-full"
            )}
          />
        )}
      </NavLink>
    </li>
  );
}

export default NavLinkItem;