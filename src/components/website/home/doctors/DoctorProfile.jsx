import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { featuredDoctor as fallbackDoctor } from "../../../../data/website/doctorsData";
import DoctorHighlights from "./DoctorHighlights";
import { getFeaturedDoctor } from "../../../../services/website/doctorCmsService";
import featuredDoctorImg from "../../../../assets/images/doctors/dr-ravindra-babu.webp";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: fallbackDoctor.name,
    qualification: fallbackDoctor.qualification,
    specialization: fallbackDoctor.specialization,
    description: fallbackDoctor.description,
    highlights: fallbackDoctor.highlights,
  });

  useEffect(() => {
    const fetchFeaturedDoctorData = async () => {
      try {
        const response = await getFeaturedDoctor();
        if (response.success && response.data) {
          const d = response.data;
          setDoctor({
            name: d.name || fallbackDoctor.name,
            qualification: d.qualification || fallbackDoctor.qualification,
            specialization: d.specialization || fallbackDoctor.specialization,
            description: d.profileSummary || d.description || fallbackDoctor.description,
            highlights: Array.isArray(d.stats) && d.stats.length > 0
              ? d.stats.map(s => ({ title: s.value, subtitle: s.label }))
              : fallbackDoctor.highlights,
          });
        }
      } catch (err) {
        console.error("Failed to load featured doctor data:", err);
      }
    };

    fetchFeaturedDoctorData();
  }, []);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Left - Locked Doctor Image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center"
      >
        <div className="group relative w-full max-w-[400px] sm:max-w-[440px] lg:max-w-[460px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-md p-3 shadow-[0_20px_50px_rgba(14,42,109,0.08)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(14,42,109,0.12)]">
          <img
            src={featuredDoctorImg}
            alt={doctor.name}
            className="w-full h-auto rounded-[24px] object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </motion.div>

      {/* Right - Doctor Details */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          id="doctor-section-heading"
          className="text-2xl font-bold tracking-tight text-[#0E2A6D] sm:text-3xl lg:text-4xl font-outfit"
        >
          {doctor.name}
        </h2>

        <p className="mt-2 text-sm sm:text-base font-bold text-sky-700">
          {doctor.qualification}
        </p>

        <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
          {doctor.specialization}
        </p>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
          {doctor.description}
        </p>

        <DoctorHighlights highlights={doctor.highlights} />
      </motion.div>
    </div>
  );
};

export default DoctorProfile;