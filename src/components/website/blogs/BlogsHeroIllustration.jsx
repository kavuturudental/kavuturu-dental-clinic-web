// src/components/blogs/BlogsHeroIllustration.jsx

import heroIllustration from "../../../assets/images/blogs/dental-hero-illustration.webp";

const BlogsHeroIllustration = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background Blur */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-100/40 blur-3xl"></div>
      <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl"></div>

      {/* Illustration */}
      <img
        src={heroIllustration}
        alt="Dental Health Articles Illustration"
        className="relative z-10 w-full max-w-[620px] object-contain transition-transform duration-500 hover:scale-[1.02]"
        loading="eager"
        draggable="false"
      />
    </div>
  );
};

export default BlogsHeroIllustration;