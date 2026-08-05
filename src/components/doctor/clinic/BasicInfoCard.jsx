import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { useDialog } from "../../../context/DialogContext";

export default function BasicInfoCard({ name, tagline, registrationNo, logoUrl, onChange, errors }) {
  const fileInputRef = useRef(null);
  const { showWarning } = useDialog();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showWarning("Please upload a valid image file.", "Invalid File Format");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange("logoUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e) => {
    e.stopPropagation();
    onChange("logoUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
          Clinic Profile
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Manage your clinic identity and branding.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Logo Section on Left */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Clinic Logo
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
          >
            {logoUrl ? (
              <>
                <img src={logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-2 text-slate-400">
                <Upload className="w-6 h-6 text-slate-300" />
                <span className="text-[10px] font-bold mt-1.5 text-slate-400">Upload Logo</span>
              </div>
            )}
          </div>
          
          {logoUrl && (
            <button
              type="button"
              onClick={removeLogo}
              className="flex items-center gap-1.5 text-[10px] font-extrabold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove logo</span>
            </button>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Inputs Section on Right */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="clinicName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinic Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clinicName"
              type="text"
              placeholder="Enter clinic name"
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                errors?.name ? "border-red-400 bg-red-50/20" : "border-slate-200"
              }`}
            />
            {errors?.name && (
              <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="registrationNo" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Registration Number (Optional)
            </label>
            <input
              id="registrationNo"
              type="text"
              placeholder="Enter registration number"
              value={registrationNo}
              onChange={(e) => onChange("registrationNo", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="clinicTagline" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinic Tagline <span className="text-red-500">*</span>
            </label>
            <input
              id="clinicTagline"
              type="text"
              placeholder="Enter tagline"
              value={tagline}
              onChange={(e) => onChange("tagline", e.target.value)}
              className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                errors?.tagline ? "border-red-400 bg-red-50/20" : "border-slate-200"
              }`}
            />
            {errors?.tagline && (
              <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.tagline}</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
