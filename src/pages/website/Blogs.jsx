import Breadcrumb from "../../components/website/blogs/Breadcrumb";
import BlogsHero from "../../components/website/blogs/BlogsHero";
import LatestArticlesHeader from "../../components/website/blogs/LatestArticlesHeader";
import BlogGrid from "../../components/website/blogs/BlogGrid";
import BlogsCTA from "../../components/website/blogs/BlogsCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const Blogs = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <BlogsHero />
        <LatestArticlesHeader />
        <BlogGrid />
        <BlogsCTA />
      </div>
      <Footer />
    </main>
  );
};

export default Blogs;