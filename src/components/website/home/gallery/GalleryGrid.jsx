// src/components/home/gallery/GalleryGrid.jsx

import GalleryCard from "./GalleryCard";
import galleryData from "../../../../data/website/galleryData";

const GalleryGrid = () => {
  const [
    doctorPatient,
    reception,
    consultation,
    treatmentRoom,
    team,
    clinicInterior,
  ] = galleryData;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column */}
      <div className="grid gap-6">
        <GalleryCard {...doctorPatient} />
        <GalleryCard {...treatmentRoom} />
      </div>

      {/* Right Column */}
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <GalleryCard {...reception} />
          <GalleryCard {...consultation} />
        </div>

        <GalleryCard {...team} />

        <GalleryCard {...clinicInterior} />
      </div>
    </div>
  );
};

export default GalleryGrid;