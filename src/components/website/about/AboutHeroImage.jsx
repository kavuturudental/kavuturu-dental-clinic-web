const AboutHeroImage = ({ image }) => {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading="eager"
      fetchPriority="high"
      className="
        absolute
        inset-0
        h-full
        w-full
        object-cover
        object-center
        select-none
        pointer-events-none
      "
      draggable="false"
    />
  );
};

export default AboutHeroImage;