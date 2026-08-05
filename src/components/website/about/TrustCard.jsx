const TrustCard = ({ item }) => {
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
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-100/40 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Title */}

        <h3 className="text-2xl font-bold leading-snug text-[#0E2A6D]">
          {item.title}
        </h3>

        {/* Divider */}

        <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#0E2A6D] to-emerald-500" />

        {/* Description */}

        <p className="mt-6 text-base leading-8 text-slate-600">
          {item.description}
        </p>
      </div>
    </article>
  );
};

export default TrustCard;