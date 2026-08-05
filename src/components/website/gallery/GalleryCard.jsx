// src/components/gallery/GalleryCard.jsx

const GalleryCard = ({ image, alt, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        group
        relative
        aspect-[4/3]
        overflow-hidden
        rounded-3xl
        border border-slate-200/80
        bg-white
        shadow-[0_8px_24px_rgba(14,42,109,0.06)]
        transition-all
        duration-500
        hover:-translate-y-1.5
        hover:shadow-xl
        hover:border-sky-300
        cursor-pointer
      "
    >
      <img
        src={image}
        alt={alt || "Clinic Gallery Image"}
        loading="lazy"
        className="
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-106
        "
      />
    </div>
  );
};

export default GalleryCard;
