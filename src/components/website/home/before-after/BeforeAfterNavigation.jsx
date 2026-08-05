// src/components/home/before-after/BeforeAfterNavigation.jsx

import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BeforeAfterNavigation = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onDotClick,
}) => {
  return (
    <div className="mt-10 flex items-center justify-between gap-6">
      {/* Previous */}
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous Case"
        className="
          group
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary
          hover:bg-primary
          hover:text-white
        "
      >
        <ChevronLeft
          size={22}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      </button>

      {/* Dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to case ${index + 1}`}
            aria-current={currentIndex === index}
            onClick={() => onDotClick(index)}
            className={`
              rounded-full
              transition-all
              duration-300

              ${
                currentIndex === index
                  ? "h-3 w-10 bg-primary"
                  : "h-3 w-3 bg-slate-300 hover:bg-primary/50"
              }
            `}
          />
        ))}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next Case"
        className="
          group
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary
          hover:bg-primary
          hover:text-white
        "
      >
        <ChevronRight
          size={22}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
};

BeforeAfterNavigation.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onDotClick: PropTypes.func.isRequired,
};

export default BeforeAfterNavigation;