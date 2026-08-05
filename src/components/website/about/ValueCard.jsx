const ValueCard = ({ value, number }) => {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-100
        hover:shadow-xl
      "
    >
      {/* Glow */}

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Number */}

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E2A6D] to-[#2B6CB0] text-xl font-bold text-white shadow-lg">
          {String(number).padStart(2, "0")}
        </div>

        {/* Title */}

        <h3 className="mt-8 text-2xl font-bold text-[#0E2A6D]">
          {value.title}
        </h3>

        {/* Divider */}

        <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#0E2A6D] to-emerald-500" />

        {/* Description */}

        <p className="mt-6 text-base leading-8 text-slate-600">
          {value.description}
        </p>
      </div>
    </article>
  );
};

export default ValueCard;