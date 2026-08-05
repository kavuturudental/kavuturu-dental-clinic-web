import React from "react";
import AboutBadge from "./AboutBadge";

const AboutIntroContent = ({ data }) => {
  return (
    <div className="flex max-w-xl flex-col items-start">
      {/* Badge */}
      <AboutBadge>{data.badge || "About Kavuturu Dental Clinic"}</AboutBadge>

      {/* Heading */}
      <h2
        id="about-introduction-heading"
        className="
          mt-6
          text-4xl
          font-bold
          leading-tight
          tracking-tight
          text-[#0E2A6D]
          sm:text-5xl
          lg:text-[3.35rem]
        "
      >
        {data.heading}
      </h2>

      {/* Description */}
      <p
        className="
          mt-8
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
            Founded by{" "}
            <span className="font-semibold text-[#0E2A6D]">
              Dr. Ravindrababu
            </span>
            , <strong className="font-extrabold text-[#16A34A]">Kavuturu Dental Clinic</strong> combines advanced dental technology with
            compassionate, patient-focused care. Since opening, we have been committed to providing comfortable, reliable, and high-quality dental treatments for every smile.
          </>
        )}
      </p>

      {data.extraDescription && (
        <p
          className="
            mt-6
            text-lg
            leading-8
            text-slate-600
          "
        >
          {data.extraDescription}
        </p>
      )}
    </div>
  );
};

export default AboutIntroContent;