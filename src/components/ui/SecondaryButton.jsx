import { Link } from "react-router-dom";
import clsx from "clsx";

function SecondaryButton({
  children,
  to = "#",
  className = "",
  icon,
  fullWidth = false,
}) {
  return (
    <Link
      to={to}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        gap-2

        h-14
        px-8

        rounded-2xl

        border
        border-[#0E2A6D]

        bg-white

        text-[#0E2A6D]

        text-base
        font-semibold

        transition-all
        duration-300

        hover:bg-[#0E2A6D]
        hover:text-white

        active:translate-y-0

        focus:outline-none
        focus:ring-4
        focus:ring-blue-200
        `,
        fullWidth && "w-full",
        className
      )}
    >
      <span>{children}</span>

      {icon && <span>{icon}</span>}
    </Link>
  );
}

export default SecondaryButton;