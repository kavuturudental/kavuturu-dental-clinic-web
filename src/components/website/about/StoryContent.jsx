// src/components/about/StoryContent.jsx

const StoryContent = ({ data }) => {
  return (
    <>
      {/* Section Heading */}
      <h2
        id="our-story-heading"
        className="
          text-4xl
          font-bold
          tracking-tight
          text-slate-900
          lg:text-5xl
        "
      >
        {data.title}
      </h2>

      {/* Decorative Divider */}
      <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-emerald-500" />

      {/* Description */}
      <p
        className="
          mx-auto
          mt-8
          max-w-3xl
          text-lg
          leading-8
          text-slate-600
        "
      >
        {data.description}
      </p>
    </>
  );
};

export default StoryContent;