const BlogHeader = () => {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {/* Badge */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
          Latest Articles
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold tracking-tight text-[#0E2A6D] sm:text-3xl lg:text-4xl font-outfit">
        Expert Tips for a <span className="text-[#0E2A6D]">Healthier Smile</span>
      </h2>

      {/* Description */}
      <p className="mx-auto mt-2 text-sm leading-relaxed text-slate-500">
        Stay informed with expert advice, treatment guides, oral hygiene tips, and updates from Kavuturu Dental Clinic.
      </p>
    </div>
  );
};

export default BlogHeader;