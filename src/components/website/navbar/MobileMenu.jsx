import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, X } from "lucide-react";

import NavLinks from "./NavLinks";
import { useAppointment } from "../bookAppointment";

function MobileMenu({
  isOpen,
  onClose,
  activeSection,
  setActiveSection,
}) {
  const { openModal } = useAppointment();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  const handleBookAppointment = () => {
    onClose();
    openModal();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      />

      {/* Drawer */}

      <aside
        className="
          fixed
          right-0
          top-0
          z-50
          flex
          h-screen
          w-full
          max-w-[320px]
          flex-col
          bg-white
          shadow-2xl
          lg:hidden
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-semibold text-primary font-outfit">
            Menu
          </h2>

          <button
            type="button"
            aria-label="Close Menu"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-primary
              transition
              hover:bg-slate-100
              cursor-pointer
            "
          >
            <X size={26} />
          </button>
        </div>

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <NavLinks
            mobile
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLinkClick={onClose}
          />
        </div>

        {/* CTA */}

        <div className="border-t border-border p-6">
          <button
            type="button"
            onClick={handleBookAppointment}
            className="
              group
              inline-flex
              h-12
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-xl
              bg-secondary
              px-5
              text-sm
              font-bold
              text-white
              whitespace-nowrap
              shadow-lg
              shadow-green-500/25
              transition-all
              duration-300
              hover:bg-secondary-dark
              hover:shadow-xl
              hover:shadow-green-500/30
              active:scale-98
              cursor-pointer
            "
          >
            <span className="whitespace-nowrap">Book Appointment</span>
            <Calendar size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
        </div>
      </aside>
    </>
  );
}

export default MobileMenu;