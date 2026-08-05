const MissionVisionCard = ({ data }) => {
  return (
    <article
      className="
        group
        relative
        h-full
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
        lg:p-10
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-blue-100/40
          blur-3xl
        "
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Badge */}
        <span
          className="
            inline-flex
            w-fit
            items-center
            rounded-full
            bg-blue-50
            px-4
            py-2
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[#0E2A6D]
          "
        >
          {data.badge}
        </span>

        {/* Heading */}
        <h3
          className="
            mt-6
            text-3xl
            font-bold
            leading-tight
            tracking-tight
            text-[#0E2A6D]
          "
        >
          {data.heading}
        </h3>

        {/* Divider */}
        <div className="mt-6 h-px w-16 bg-gradient-to-r from-[#0E2A6D] to-emerald-500" />

        {/* Description */}
        <p
          className="
            mt-6
            flex-1
            text-lg
            leading-8
            text-slate-600
          "
        >
          {data.description}
        </p>
      </div>
    </article>
  );
};

export default MissionVisionCard;