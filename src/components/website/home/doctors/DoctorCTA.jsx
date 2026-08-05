import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DoctorCTA = () => {
  return (
    <div className="mt-10">
      <Link
        to="/doctors"
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-[#0E2A6D]
          px-8
          py-3.5
          text-sm
          font-bold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:bg-sky-700
          hover:shadow-xl
        "
      >
        <span>View All Doctors</span>
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
};

export default DoctorCTA;