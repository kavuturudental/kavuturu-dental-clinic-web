// src/pages/website/BlogDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  ArticleBreadcrumb,
  ArticleHero,
  ArticleContent,
  ArticleCTA,
} from "../../components/website/blogs";
import * as staticArticles from "../../data/blogs/articles";
import Footer from "../../components/website/footer/Footer";
import { getBlogBySlugOrId } from "../../services/website/blogService";

const BlogDetails = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      try {
        const response = await getBlogBySlugOrId(slug);
        if (response.success && response.data) {
          setArticle(response.data);
        } else {
          // Fallback to static article data if available
          const staticMatch = Object.values(staticArticles).find((art) => art.slug === slug);
          setArticle(staticMatch || null);
        }
      } catch (err) {
        console.error("Failed to fetch article detail:", err);
        const staticMatch = Object.values(staticArticles).find((art) => art.slug === slug);
        setArticle(staticMatch || null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-white pt-[72px] lg:pt-[88px] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-slate-500 gap-2 py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
          <span className="text-xs font-semibold">Loading article details...</span>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="bg-white pt-[72px] lg:pt-[88px] min-h-screen flex flex-col justify-between">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            Error 404
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl leading-tight">
            Article Not Found
          </h1>

          <p className="mt-4 text-slate-650 max-w-md mx-auto">
            The dental article you are looking for does not exist or has been relocated to another address.
          </p>

          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-semibold text-white hover:bg-sky-700 transition-colors shadow-md"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white pt-[72px] lg:pt-[88px]">
      <ArticleBreadcrumb article={article} />
      
      <ArticleHero article={article} />
      
      <ArticleContent article={article} />
      
      <ArticleCTA />

      <Footer />
    </main>
  );
};

export default BlogDetails;
