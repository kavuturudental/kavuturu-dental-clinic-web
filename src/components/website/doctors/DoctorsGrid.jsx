import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { doctors as fallbackDoctors } from "../../../data/website/doctorsData";
import { getAllDoctors } from "../../../services/website/doctorCmsService";

const DoctorsGrid = () => {
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    const fetchDoctorsData = async () => {
      try {
        const response = await getAllDoctors();
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setDoctorList(response.data);
        } else {
          setDoctorList(fallbackDoctors);
        }
      } catch (err) {
        console.error("Failed to load doctors grid data:", err);
        setDoctorList(fallbackDoctors);
      }
    };

    fetchDoctorsData();
  }, []);

  const displayDoctors = doctorList.length > 0 ? doctorList : fallbackDoctors;

  // Filter out featured doctor (Dr. K. Ravindra Babu) from the main Doctors page grid
  const specialists = displayDoctors.filter(
    (d) => !d.isFeatured && !(d.name && d.name.toLowerCase().includes("ravindra"))
  );

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Our Specialists
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#0E2A6D] md:text-4xl lg:text-5xl font-outfit">
            Specialized Dental Care Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Our team of visiting and consultant specialists covers all areas of advanced dentistry to ensure complete oral health care.
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialists.map((doctor, index) => (
            <div
              key={doctor._id || doctor.id || index}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[#0E2A6D] transition-colors duration-300">
                  {doctor.name}
                </h3>
                
                <p className="mt-1.5 text-sm font-semibold text-sky-700">
                  {doctor.qualification}
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {doctor.specialization}
                </p>

                {/* Divider line */}
                <div className="my-4 h-px w-12 bg-gradient-to-r from-sky-500 to-transparent" />

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Area of Expertise:
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    {doctor.profileSummary || doctor.description}
                  </p>
                </div>
              </div>

              {/* Optional Experience */}
              {doctor.experience && doctor.experience.trim().length > 0 && (
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                    <Clock size={14} className="text-sky-500" />
                    {doctor.experience} Experience
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DoctorsGrid;