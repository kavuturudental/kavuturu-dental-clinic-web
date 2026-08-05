import React from "react";
import { Globe } from "lucide-react";

const Facebook = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Linkedin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function SocialLinksCard({ socialLinks, onChange }) {
  const handleNestedChange = (field, value) => {
    onChange("socialLinks", { ...socialLinks, [field]: value });
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
          Website & Social Links
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Configure external links and social media accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Website URL */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="socialWebsite" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            Website URL
          </label>
          <input
            id="socialWebsite"
            type="text"
            placeholder="e.g. https://kavuturudental.com"
            value={socialLinks.websiteUrl || ""}
            onChange={(e) => handleNestedChange("websiteUrl", e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
          />
        </div>

        {/* Facebook */}
        <div className="space-y-1.5">
          <label htmlFor="socialFacebook" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Facebook className="w-3.5 h-3.5 text-blue-600" />
            Facebook Link
          </label>
          <input
            id="socialFacebook"
            type="text"
            placeholder="e.g. https://facebook.com/..."
            value={socialLinks.facebook || ""}
            onChange={(e) => handleNestedChange("facebook", e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
          />
        </div>

        {/* Instagram */}
        <div className="space-y-1.5">
          <label htmlFor="socialInstagram" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            Instagram Link
          </label>
          <input
            id="socialInstagram"
            type="text"
            placeholder="e.g. https://instagram.com/..."
            value={socialLinks.instagram || ""}
            onChange={(e) => handleNestedChange("instagram", e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
          />
        </div>

        {/* YouTube */}
        <div className="space-y-1.5">
          <label htmlFor="socialYoutube" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-red-600" />
            YouTube Link
          </label>
          <input
            id="socialYoutube"
            type="text"
            placeholder="e.g. https://youtube.com/..."
            value={socialLinks.youtube || ""}
            onChange={(e) => handleNestedChange("youtube", e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <label htmlFor="socialLinkedin" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-blue-700" />
            LinkedIn Link
          </label>
          <input
            id="socialLinkedin"
            type="text"
            placeholder="e.g. https://linkedin.com/company/..."
            value={socialLinks.linkedin || ""}
            onChange={(e) => handleNestedChange("linkedin", e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
          />
        </div>
      </div>
    </div>
  );
}
