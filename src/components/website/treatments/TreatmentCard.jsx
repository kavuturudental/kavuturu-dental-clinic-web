import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TreatmentCard = ({ title, shortDescription, image, alt, slug }) => {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_8px_30px_rgba(14,42,109,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-sky-300
        hover:shadow-[0_20px_40px_rgba(14,42,109,0.1)]
      "
    >
      {/* Single Continuous White Surface Image Area */}
      <div className="relative flex h-48 w-full items-center justify-center bg-white px-6 pt-6 pb-2 lg:h-52">
        <img
          src={image}
          alt={alt || title}
          loading="lazy"
          className="
            max-h-full
            max-w-full
            object-contain
            object-center
            transition-transform
            duration-500
            group-hover:scale-[1.02]
          "
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 pt-2 lg:p-7 lg:pt-3">
        <h3 className="font-outfit text-xl font-bold leading-snug text-[#0E2A6D]">
          {title}
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
          {shortDescription}
        </p>

        <Link
          to={`/treatments?section=${slug}`}
          aria-label={`Learn more about ${title}`}
          className="
            group/btn
            mt-5
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-[#0E2A6D]/20
            bg-white
            px-4.5
            py-2.5
            text-xs
            font-bold
            text-[#0E2A6D]
            shadow-sm
            transition-all
            duration-300
            hover:border-[#0E2A6D]
            hover:bg-[#0E2A6D]
            hover:text-white
            hover:shadow-md
            focus:outline-none
          "
        >
          <span>Learn More</span>

          <ArrowRight
            size={14}
            className="
              transition-transform
              duration-300
              group-hover/btn:translate-x-1
            "
          />
        </Link>
      </div>
    </article>
  );
};

export default TreatmentCard;