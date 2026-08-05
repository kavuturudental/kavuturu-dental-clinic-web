import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GalleryCTA = () => {
  return (
    <div className="mt-14 flex justify-center">
      <Link
        to="/gallery"
        className="
          group
          inline-flex
          items-center
          gap-3
          rounded-full
          bg-primary
          px-7
          py-4
          text-base
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <span>View Full Gallery</span>

        <span
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/15
            transition-all
            duration-300
            group-hover:bg-white
            group-hover:text-primary
          "
        >
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Link>
    </div>
  );
};

export default GalleryCTA;