// src/components/about/AboutImage.jsx

const AboutImage = ({ image }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-slate-200/80
          bg-white/90
          backdrop-blur-md
          p-3.5
          shadow-[0_20px_50px_rgba(14,42,109,0.08)]
          transition-all
          duration-300
          hover:shadow-[0_25px_60px_rgba(14,42,109,0.12)]
        "
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="
            block
            h-auto
            w-full
            rounded-2xl
            object-contain
            select-none
          "
          draggable="false"
        />
      </div>
    </div>
  );
};

export default AboutImage;