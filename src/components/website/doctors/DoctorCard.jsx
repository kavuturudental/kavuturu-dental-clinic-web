// src/components/doctors/DoctorCard.jsx

const DoctorCard = ({
  image,
  name,
  qualification,
  specialization,
  experience,
  description,
}) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(14,42,109,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="mt-6">
        {experience && (
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {experience} Experience
          </span>
        )}

        <h3 className="mt-2 text-xl font-bold text-slate-900">
          {name}
        </h3>

        <p className="text-sm font-medium text-primary">
          {qualification}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-500">
          {specialization}
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">
          {description}
        </p>
      </div>
    </article>
  );
};

export default DoctorCard;
