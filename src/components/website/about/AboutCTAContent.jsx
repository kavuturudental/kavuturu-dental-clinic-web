import React from "react";
import { Phone } from "lucide-react";

const AboutCTAContent = ({ data }) => {
  return (
    <div className="max-w-lg">
      <h2
        id="about-cta-heading"
        className="
          text-4xl
          font-bold
          leading-tight
          tracking-tight
          text-slate-900
          lg:text-5xl
          font-outfit
        "
      >
        {data.heading}
      </h2>

      <p
        className="
          mt-6
          text-lg
          leading-8
          text-slate-600
        "
      >
        {data.description}
      </p>

      <div className="mt-10">
        <a
          href="tel:+918309479901"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-emerald-600
            px-7
            py-3.5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-emerald-700
            hover:shadow-lg
            cursor-pointer
          "
        >
          <Phone size={16} />
          <span>Call Now</span>
        </a>
      </div>
    </div>
  );
};

export default AboutCTAContent;