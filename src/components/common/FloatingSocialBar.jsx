import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

/**
 * Social and Contact Media links configuration
 * Tailored with Apple-inspired minimalism, default primary background #0E2A6D,
 * and brand-colored hover transitions with subtle animations.
 */
const SOCIAL_ITEMS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    tooltip: "WhatsApp",
    href: "https://wa.me/918309479901",
    icon: FaWhatsapp,
    ariaLabel: "Chat with Kavuturu Dental Clinic on WhatsApp",
    hoverBg: "hover:bg-[#25D366]",
    hoverShadow: "hover:shadow-[0_10px_30px_rgba(37,211,102,0.45)]",
    focusRing: "focus-visible:ring-[#25D366]",
    containerAnim: "",
    iconAnim: "transition-transform duration-300 group-hover:scale-120",
    hasRippleWave: true,
    rippleColor: "bg-[#25D366]",
    isExternal: true,
  },
  {
    id: "call",
    name: "Call Now",
    tooltip: "Call Now",
    href: "tel:+918309479901",
    icon: FaPhoneAlt,
    ariaLabel: "Call Kavuturu Dental Clinic at +91 83094 79901",
    hoverBg: "hover:bg-[#16A34A]",
    hoverShadow: "hover:shadow-[0_10px_30px_rgba(22,163,74,0.45)]",
    focusRing: "focus-visible:ring-[#16A34A]",
    containerAnim: "animate-social-breathe",
    iconAnim: "transition-transform duration-300 animate-phone-ring-hover",
    hasRippleWave: false,
    isExternal: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    tooltip: "Facebook",
    href: "https://www.facebook.com/share/18wGYJQ2cq/",
    icon: FaFacebookF,
    ariaLabel: "Visit Kavuturu Dental Clinic on Facebook",
    hoverBg: "hover:bg-[#1877F2]",
    hoverShadow: "hover:shadow-[0_10px_30px_rgba(24,119,242,0.45)]",
    focusRing: "focus-visible:ring-[#1877F2]",
    containerAnim: "animate-social-float",
    iconAnim: "transition-transform duration-300 group-hover:scale-120",
    hasRippleWave: false,
    isExternal: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    tooltip: "Instagram",
    href: "https://www.instagram.com/kavuturu_dental_clinic/",
    icon: FaInstagram,
    ariaLabel: "Follow Kavuturu Dental Clinic on Instagram",
    hoverBg: "hover:bg-[radial-gradient(ellipse_at_30%_90%,_#f09433_0%,_#e6683c_25%,_#dc2743_50%,_#cc2366_75%,_#bc1888_100%)] hover:rotate-6",
    hoverShadow: "hover:shadow-[0_10px_30px_rgba(220,39,67,0.45)]",
    focusRing: "focus-visible:ring-[#dc2743]",
    containerAnim: "animate-social-float",
    iconAnim: "transition-transform duration-300 group-hover:scale-120",
    hasRippleWave: false,
    isExternal: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    tooltip: "YouTube",
    href: "https://youtube.com/@kavuturudentalclinic?si=3TwWGD68iN6BrJIb",
    icon: FaYoutube,
    ariaLabel: "Subscribe to Kavuturu Dental Clinic on YouTube",
    hoverBg: "hover:bg-[#FF0000]",
    hoverShadow: "hover:shadow-[0_10px_30px_rgba(255,0,0,0.45)]",
    focusRing: "focus-visible:ring-[#FF0000]",
    containerAnim: "animate-social-heartbeat",
    iconAnim: "transition-transform duration-300 group-hover:scale-125",
    hasRippleWave: false,
    isExternal: true,
  },
];

const FloatingSocialBar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside
      aria-label="Social and Contact Quick Access Bar"
      className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-3 sm:gap-3.5 select-none"
    >
      {SOCIAL_ITEMS.map((item, index) => {
        const IconComponent = item.icon;

        return (
          <div key={item.id} className="relative group flex items-center">
            
            {/* Tooltip Popup */}
            <div
              role="tooltip"
              id={`tooltip-${item.id}`}
              className="
                absolute right-full mr-3 top-1/2 -translate-y-1/2
                px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs md:text-sm font-bold
                shadow-xl shadow-slate-900/10 border border-slate-100
                whitespace-nowrap pointer-events-none
                opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-300 ease-out
                flex items-center z-10
              "
            >
              <span>{item.tooltip}</span>

              {/* Tooltip Caret pointing right */}
              <span
                className="
                  absolute top-1/2 -translate-y-1/2 left-full
                  w-0 h-0
                  border-y-[5px] border-y-transparent
                  border-l-[6px] border-l-white
                  drop-shadow-xs
                "
                aria-hidden="true"
              />
            </div>

            {/* Ripple wave background animation (for WhatsApp) */}
            {item.hasRippleWave && (
              <span
                className={`absolute inset-0 rounded-full ${item.rippleColor} animate-social-ripple pointer-events-none -z-10`}
                aria-hidden="true"
              />
            )}

            {/* Circular Button */}
            <a
              href={item.href}
              aria-label={item.ariaLabel}
              aria-describedby={`tooltip-${item.id}`}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              style={{
                transitionDelay: mounted ? "0ms" : `${index * 80}ms`,
              }}
              className={`
                relative
                w-[52px] h-[52px] md:w-[60px] md:h-[60px]
                rounded-full flex items-center justify-center
                text-white bg-[#0E2A6D]
                border border-white/20
                shadow-md shadow-[#0E2A6D]/25 ${item.hoverShadow} ${item.hoverBg}
                cursor-pointer
                transition-all duration-300 ease-out
                hover:scale-[1.08] hover:-translate-x-2
                focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${item.focusRing}
                ${item.containerAnim}
                ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-12"
                }
              `}
            >
              <IconComponent
                className={`text-xl md:text-2xl ${item.iconAnim}`}
              />
            </a>
          </div>
        );
      })}
    </aside>
  );
};

export default FloatingSocialBar;
