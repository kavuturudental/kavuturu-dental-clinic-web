import { Link } from "react-router-dom";
import clsx from "clsx";

function Button({
  children,
  to = "#",
  icon = null,
  className = "",
  fullWidth = false,
  onClick,
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          `
          inline-flex
          items-center
          justify-center
          gap-2.5
          h-13
          px-6
          rounded-xl
          bg-secondary
          text-white
          text-sm
          sm:text-base
          font-semibold
          whitespace-nowrap
          transition-all
          duration-300
          hover:bg-secondary-dark
          hover:-translate-y-0.5
          focus:outline-none
          focus:ring-4
          focus:ring-green-200
          cursor-pointer
          shrink-0
          `,
          fullWidth && "w-full",
          className
        )}
      >
        <span className="whitespace-nowrap">{children}</span>

        {icon && (
          <span className="flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        gap-2.5
        h-13
        px-6
        rounded-xl
        bg-secondary
        text-white
        text-sm
        sm:text-base
        font-semibold
        whitespace-nowrap
        transition-all
        duration-300
        hover:bg-secondary-dark
        hover:-translate-y-0.5
        focus:outline-none
        focus:ring-4
        focus:ring-green-200
        shrink-0
        `,
        fullWidth && "w-full",
        className
      )}
    >
      <span className="whitespace-nowrap">{children}</span>

      {icon && (
        <span className="flex items-center justify-center shrink-0">
          {icon}
        </span>
      )}
    </Link>
  );
}

export default Button;