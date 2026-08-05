// src/components/doctor/website/SafeImage.jsx

import React, { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

export default function SafeImage({
  src,
  alt = "Image",
  className = "w-12 h-10 object-cover rounded-xl border border-slate-200",
  fallbackText = "No Image"
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidSrc =
    src &&
    typeof src === "string" &&
    src.trim() !== "" &&
    src !== "null" &&
    src !== "undefined" &&
    src !== "broken-url";

  if (!isValidSrc || hasError) {
    return (
      <div
        className={`${className} bg-slate-100 flex items-center justify-center text-slate-400 font-bold select-none text-[10px] p-1 border border-slate-200/80`}
        title="No image available"
      >
        <ImageIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
