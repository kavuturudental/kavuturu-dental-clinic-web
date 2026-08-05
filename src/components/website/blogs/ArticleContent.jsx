// src/components/blogs/ArticleContent.jsx

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

// Simple inline parser for **bold** and *italic* markdown tags (legacy fallback)
const parseMarkdownText = (text) => {
  if (typeof text !== "string") return text;
  
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

const ArticleContent = ({ article }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const isArrayContent = Array.isArray(article?.content);
  const isHtmlString = typeof article?.content === "string" && (article.content.includes("<") || article.content.includes(">"));
  const hasFaqs = Array.isArray(article?.faqs) && article.faqs.length > 0;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-8 pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        
        {/* Main Article Content */}
        <div className="text-slate-700 leading-8 space-y-6">
          {isArrayContent ? (
            article.content.map((block, index) => {
              switch (block.type) {
                case "heading2":
                  return (
                    <h2
                      key={index}
                      className="mt-12 text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 font-outfit"
                    >
                      {block.text}
                    </h2>
                  );
                  
                case "heading3":
                  return (
                    <h3
                      key={index}
                      className="mt-8 text-xl font-bold text-slate-900 pt-2 font-outfit"
                    >
                      {block.text}
                    </h3>
                  );
                  
                case "list-bullet":
                  return (
                    <ul
                      key={index}
                      className="mt-6 list-disc pl-6 space-y-3 text-base md:text-lg text-slate-650"
                    >
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{parseMarkdownText(item)}</li>
                      ))}
                    </ul>
                  );
                  
                case "list-numbered":
                  return (
                    <ol
                      key={index}
                      className="mt-6 list-decimal pl-6 space-y-3 text-base md:text-lg text-slate-650"
                    >
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{parseMarkdownText(item)}</li>
                      ))}
                    </ol>
                  );
                  
                case "note":
                  return (
                    <div
                      key={index}
                      className="mt-8 rounded-2xl border-l-4 border-sky-500 bg-sky-50/70 p-5 text-base text-sky-900 font-medium shadow-sm leading-relaxed"
                    >
                      {parseMarkdownText(block.text)}
                    </div>
                  );
                  
                case "paragraph":
                default:
                  return (
                    <p key={index} className="text-base md:text-lg leading-8 text-slate-600">
                      {parseMarkdownText(block.text)}
                    </p>
                  );
              }
            })
          ) : isHtmlString ? (
            <div
              dangerouslySetInnerHTML={{ __html: article?.content || "" }}
              className="text-base md:text-lg leading-8 text-slate-600 font-sans space-y-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_ol]:space-y-2 [&_li]:text-slate-700 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:bg-sky-50/60 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-sky-900 [&_a]:text-sky-600 [&_a]:underline [&_hr]:my-6 [&_hr]:border-slate-200"
            />
          ) : (
            <div className="text-base md:text-lg leading-8 text-slate-600 whitespace-pre-line font-normal space-y-4">
              {parseMarkdownText(article?.content || "")}
            </div>
          )}
        </div>

        {/* Dynamic FAQ Accordion Section */}
        {hasFaqs && (
          <div className="mt-16 pt-10 border-t border-slate-200/80 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Common questions regarding this dental topic.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {article.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all duration-200 hover:border-sky-300 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer hover:bg-slate-100/50 transition-colors"
                    >
                      <span>Q: {faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-sky-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600 border-t border-slate-200/60 pt-3.5 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ArticleContent;
