// src/components/blogs/LatestArticlesHeader.jsx

const LatestArticlesHeader = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 pt-16">
      <div className="border-b border-slate-100 pb-8">
        <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
          Latest Publications
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl">
          Articles & Oral Health Guides
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-2xl">
          Browse through our clinical guides, dental hygiene tips, and latest medical articles to learn how we protect your smile.
        </p>
      </div>
    </div>
  );
};

export default LatestArticlesHeader;
