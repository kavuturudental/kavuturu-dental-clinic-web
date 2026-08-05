import { ArrowUpRight } from "lucide-react";

const aspectClasses = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "9/16": "aspect-[9/16]",
};

const GalleryCard = ({ image, title, alt, aspect }) => {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border border-slate-200/70
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-xl
        ${aspectClasses[aspect]}
      `}
    >
      {/* Image */}
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-110
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-slate-950/75
          via-slate-900/15
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Bottom Content */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          flex
          items-end
          justify-between
          p-5
          opacity-0
          translate-y-4
          transition-all
          duration-500
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-white">
            {title}
          </h3>
        </div>

        {/* Icon */}
        <button
          type="button"
          aria-label={title}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white
            text-slate-900
            shadow-lg
            transition-all
            duration-300
            hover:scale-110
            hover:bg-primary
            hover:text-white
          "
        >
          <ArrowUpRight size={20} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
};

export default GalleryCard;