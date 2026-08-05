const AboutIntroImage = ({ image }) => {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

      {/* Decorative Border */}
      <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] border border-blue-100" />

      {/* Image Card */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-slate-200
          bg-white
          shadow-lg
          transition-all
          duration-500
          hover:-translate-y-2
          hover:shadow-2xl
        "
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          draggable="false"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* Soft Gradient Overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-[#0E2A6D]/10
            via-transparent
            to-transparent
          "
        />
      </div>
    </div>
  );
};

export default AboutIntroImage;