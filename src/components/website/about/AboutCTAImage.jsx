// src/components/about/AboutCTAImage.jsx

const AboutCTAImage = ({ image }) => {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      draggable="false"
      className="
        block
        w-full
        h-[240px]
        sm:h-[320px]
        lg:h-[460px]
        object-cover
        object-[75%_center]
      "
    />
  );
};

export default AboutCTAImage;