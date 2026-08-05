const AboutHeroOverlay = () => {
  return (
    <>
      {/* Left White Gradient */}
      <div
        className="
          absolute
          inset-y-0
          left-0
          z-10
          w-full
          bg-gradient-to-r
          from-white
          via-white/90
          via-30%
          to-transparent
          md:w-3/4
          lg:w-2/3
        "
      />

      {/* Optional subtle bottom fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-10
          h-20
          bg-gradient-to-t
          from-white/10
          to-transparent
        "
      />
    </>
  );
};

export default AboutHeroOverlay;