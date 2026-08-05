const AboutHeroContent = () => {
  return (
    <div className="flex flex-col items-start w-full">
      {/* Slogan as Main Heading */}
      <h1
        className="
          font-outfit
          text-[36px]
          sm:text-[40px]
          md:text-[48px]
          lg:text-[60px]
          font-extrabold
          leading-[1.08]
          tracking-[-0.02em]
          text-[#0E2A6D]
        "
      >
        Your Smile <br />
        Our Responsibility
      </h1>
    </div>
  );
};

export default AboutHeroContent;