// src/components/home/doctors/DoctorsSection.jsx

import { Link } from "react-router-dom";
import { ArrowRight, UserCheck } from "lucide-react";
import DoctorProfile from "./DoctorProfile";

const DoctorsSection = () => {
  return (
    <section
      id="doctors"
      className="bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
      aria-labelledby="doctor-section-heading"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Section Header matching Clinic Showcase design */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Our Specialist
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
            Meet Our Chief Specialist
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Dedicated expert providing compassionate, high-precision laser endodontics and dental care in Tirupati.
          </p>
        </div>

        {/* Featured Doctor */}
        <DoctorProfile />

        {/* Section Bottom CTA (View All Doctors) */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/doctors"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;