import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AboutBadge from "./AboutBadge";

const AboutContent = ({ data }) => {
  return (
    <div className="flex max-w-xl flex-col items-start">
      {/* Desktop Badge */}
      <div className="hidden lg:block">
        <AboutBadge>About Kavuturu Dental Clinic</AboutBadge>
      </div>

      {/* Heading */}
      <h2
        id="about-heading"
        className="
          mt-6
          text-4xl
          font-bold
          leading-tight
          tracking-tight
          text-[#0E2A6D]
          lg:text-5xl
        "
      >
        {data.heading}
      </h2>

      {/* Description */}
      <p
        className="
          mt-6
          text-lg
          leading-8
          text-slate-600
        "
      >
        {typeof data.description === "string" ? (
          data.description.includes("Kavuturu Dental Clinic") ? (
            data.description.split("Kavuturu Dental Clinic").map((part, index, arr) => (
              <React.Fragment key={index}>
                {part}
                {index < arr.length - 1 && (
                  <strong className="font-extrabold text-[#16A34A]">
                    Kavuturu Dental Clinic
                  </strong>
                )}
              </React.Fragment>
            ))
          ) : (
            data.description
          )
        ) : (
          <>
            {data.description?.before}
            {data.description?.highlight && (
              <strong className="font-extrabold text-[#16A34A]">
                {data.description.highlight}
              </strong>
            )}
            {data.description?.after}
          </>
        )}
      </p>

      {/* Secondary CTA */}
      <div className="mt-10">
        <Link
          to={data.cta?.href || "/about"}
          className="
            group
            inline-flex
            items-center
            gap-2.5
            rounded-xl
            border
            border-[#0E2A6D]/25
            bg-white/90
            backdrop-blur-sm
            px-6
            py-3
            text-xs
            sm:text-sm
            font-bold
            text-[#0E2A6D]
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-[#0E2A6D]
            hover:bg-[#0E2A6D]
            hover:text-white
            hover:shadow-md
            cursor-pointer
          "
        >
          <span>{data.cta?.label || "Learn More About Us"}</span>

          <ArrowRight
            size={16}
            className="
              transition-transform
              duration-300
              ease-out
              group-hover:translate-x-1
            "
          />
        </Link>
      </div>
    </div>
  );
};

export default AboutContent;