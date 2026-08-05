// src/pages/doctor/WebsiteManagement/Homepage.jsx

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Home,
  Info,
  Stethoscope,
  Users,
  Award,
  Split,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  PhoneCall,
  LayoutTemplate,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Star,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Pin,
  X,
  Globe,
  Lock,
  Link as LinkIcon
} from "lucide-react";
import websiteService from "../../../services/websiteService";
import heroService from "../../../services/website/heroService";
import aboutService from "../../../services/website/aboutService";
import HomepagePreview from "../../../components/doctor/website/HomepagePreview";

const safeVal = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  return fallback;
};

const ensureSixTreatments = (list) => {
  const defaultList = [
    { id: "trt-1", name: "Laser Root Canal", shortDesc: "Single sitting, pain-free root canal treatment using advanced diode lasers.", image: "/assets/images/treatments/laser-root-canal.webp", displayOnHomepage: true, order: 1 },
    { id: "trt-2", name: "Dental Implants", shortDesc: "Permanent, natural-looking tooth replacement solution with high success rate.", image: "/assets/images/treatments/dental-implants.webp", displayOnHomepage: true, order: 2 },
    { id: "trt-3", name: "Smile Makeover", shortDesc: "Custom composite veneers & full mouth aesthetic smile alignment.", image: "/assets/images/beforeafter/aesthetic_composite_restorations_after.webp", displayOnHomepage: true, order: 3 },
    { id: "trt-4", name: "Teeth Whitening", shortDesc: "Advanced laser-assisted teeth whitening for a bright, radiant smile.", image: "/assets/images/treatments/teeth-whitening.webp", displayOnHomepage: true, order: 4 },
    { id: "trt-5", name: "Braces & Aligners", shortDesc: "Invisible clear aligners and ceramic braces for perfect teeth alignment.", image: "/assets/images/treatments/braces-aligners.webp", displayOnHomepage: true, order: 5 },
    { id: "trt-6", name: "Children's Dentistry", shortDesc: "Gentle pediatric dental care, cavity prevention, and fluoride treatments.", image: "/assets/images/treatments/childrens-dentistry.webp", displayOnHomepage: true, order: 6 }
  ];

  const rawList = Array.isArray(list) ? list : [];
  const uniqueItems = [];
  const seenIds = new Set();
  const seenNames = new Set();

  for (const item of rawList) {
    if (!item) continue;
    const cleanId = item.id || `trt-${Math.random()}`;
    const cleanName = (item.name || "").trim().toLowerCase();
    if (!seenIds.has(cleanId) && (!cleanName || !seenNames.has(cleanName))) {
      seenIds.add(cleanId);
      if (cleanName) seenNames.add(cleanName);
      uniqueItems.push({ ...item, id: cleanId });
    }
  }

  for (const defItem of defaultList) {
    if (uniqueItems.length >= 6) break;
    const defName = defItem.name.trim().toLowerCase();
    if (!seenIds.has(defItem.id) && !seenNames.has(defName)) {
      seenIds.add(defItem.id);
      seenNames.add(defName);
      uniqueItems.push(defItem);
    }
  }

  return uniqueItems.slice(0, 6).map((t, idx) => ({ ...t, order: idx + 1 }));
};

export default function HomepageCMS() {
  const { triggerToast } = useOutletContext() || {};

  // Hydrate Homepage State Synchronously
  const [homepageData, setHomepageData] = useState(() => {
    const rawData = websiteService.getHomepage() || {};
    const trtList = websiteService.getTreatments();
    const docList = websiteService.getDoctors();
    const baList = websiteService.getBeforeAfter();
    const revList = websiteService.getTestimonials();
    const galList = websiteService.getGallery();
    const blogList = websiteService.getBlogs();
    const contactInfo = websiteService.getContact() || {};
    const footerInfo = websiteService.getFooter() || {};

    return {
      hero: rawData.hero || {
        trustBadge: "US-FDA Approved Waterlase Laser Technology",
        title: "Painless Laser Dentistry & Advanced Dental Care",
        subtitle: "Experience world-class dental care in Eluru with Dr. K. Ravindra Babu.",
        primaryCtaText: "Book Appointment",
        primaryCtaLink: "/appointment",
        secondaryCtaText: "Explore Treatments",
        secondaryCtaLink: "/treatments",
        heroImage: "/assets/images/doctors/dr-ravindra-babu.webp"
      },
      statCards: Array.isArray(rawData.statCards) ? rawData.statCards : [
        { id: "stat-1", icon: "users", number: "25,000+", label: "Happy Patients", description: "Patients treated with quality dental care.", enabled: true, order: 1 },
        { id: "stat-2", icon: "calendar", number: "18+", label: "Years of Experience", description: "Delivering painless laser dental care.", enabled: true, order: 2 },
        { id: "stat-3", icon: "award", number: "99.4%", label: "Success Rate", description: "Highest precision endodontic success.", enabled: true, order: 3 },
        { id: "stat-4", icon: "star", number: "4.9/5", label: "Google Rating", description: "Based on 500+ verified patient reviews.", enabled: true, order: 4 }
      ],
      aboutPreview: rawData.aboutPreview || {
        heading: "Eluru's Most Trusted Dental Care Center",
        description: "Kavuturu Dental Clinic is equipped with state-of-the-art Waterlase laser technology.",
        image: "/assets/images/gallery/doctor-consultation.webp",
        buttonText: "Read Our Story",
        buttonLink: "/about"
      },
      appointmentCta: rawData.appointmentCta || {
        heading: "Ready for a Healthy, Confident Smile?",
        description: "Schedule your consultation with our chief endodontist today.",
        primaryButtonText: "Book Your Visit Now",
        primaryButtonLink: "/appointment",
        secondaryButtonText: "Call Clinic Directly",
        secondaryButtonLink: "tel:+919848012345",
        bgImage: "/assets/images/gallery/treatment-room.webp"
      },
      treatments: ensureSixTreatments(trtList),
      doctors: Array.isArray(docList) ? docList : [],
      beforeAfter: Array.isArray(baList) ? baList : [],
      testimonials: Array.isArray(revList) ? revList : [],
      gallery: Array.isArray(galList) ? galList : [],
      blogs: Array.isArray(blogList) ? blogList : [],
      contact: contactInfo,
      footer: footerInfo
    };
  });

  // Expand / Collapse Accordion State for All 11 Sections
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    about: false,
    treatments: false,
    doctors: false,
    before_after: false,
    testimonials: false,
    gallery: false,
    blogs: false,
    appointmentCta: false,
    contact: false,
    footer: false
  });

  // Modal & Preview Trigger States
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStatCard, setEditingStatCard] = useState(null);
  const [statForm, setStatForm] = useState({
    id: "",
    icon: "users",
    number: "1,000+",
    label: "Successful Treatments",
    description: "Laser dental procedures completed.",
    enabled: true
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSectionId, setPreviewSectionId] = useState("hero");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState("Just now");
  const [treatmentImagePreviewModal, setTreatmentImagePreviewModal] = useState(null);

  // WebP Image Upload Validation & Handler for Treatments
  const handleTreatmentWebPUpload = (trtId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (fileExt !== 'webp' && file.type !== 'image/webp') {
      if (triggerToast) {
        triggerToast("Invalid file format! Only .webp images are allowed for treatment cards.", "error");
      }
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      if (triggerToast) {
        triggerToast("File size exceeds 2 MB! Please select a smaller WebP image.", "error");
      }
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const currentList = Array.isArray(homepageData.treatments) ? homepageData.treatments : [];
      const updatedList = currentList.map(t => t.id === trtId ? { ...t, image: dataUrl } : t);
      handleDataChange("treatments", null, updatedList);
      if (triggerToast) {
        triggerToast("Treatment WebP image updated successfully!", "success");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Universal Drag & Drop Sorting Handlers (Treatments, Doctors, Before/After, Reviews, Gallery)
  const [draggedItem, setDraggedItem] = useState(null); // { sectionKey: 'treatments', index: 0 }
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleDragStart = (e, index, sectionKey) => {
    setDraggedItem({ sectionKey, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${sectionKey}:${index}`);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e, targetIdx, sectionKey) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.sectionKey !== sectionKey || draggedItem.index === targetIdx) {
      setDraggedItem(null);
      setDragOverIdx(null);
      return;
    }

    const currentList = Array.isArray(homepageData[sectionKey]) ? homepageData[sectionKey] : [];
    const updated = [...currentList];
    const [movedItem] = updated.splice(draggedItem.index, 1);
    updated.splice(targetIdx, 0, movedItem);

    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    handleDataChange(sectionKey, null, reordered);

    setDraggedItem(null);
    setDragOverIdx(null);

    if (triggerToast) {
      const itemName = movedItem.name || movedItem.title || movedItem.patientName || `Item`;
      triggerToast(`Reordered "${itemName}" to position #${targetIdx + 1}`, "success");
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIdx(null);
  };

  // Blog Editor State with Live Card Preview
  const [editingBlog, setEditingBlog] = useState({
    title: "Why Laser Root Canal Treatment is 100% Painless",
    summary: "Discover how dental lasers disinfect root canals gently without vibration or surgical noise.",
    cardImage: "/assets/images/treatments/laser-root-canal.webp",
    publishDate: "2026-07-30",
    readTime: "4 min read",
    isPinned: true
  });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDataChange = (category, field, value) => {
    setHomepageData((prev) => {
      if (!field && value !== undefined) {
        return { ...prev, [category]: value };
      }
      return {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [field]: value
        }
      };
    });
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      websiteService.saveHomepage(homepageData);
      if (homepageData.treatments) websiteService.saveTreatments(homepageData.treatments);
      if (homepageData.doctors) websiteService.saveDoctors(homepageData.doctors);
      if (homepageData.beforeAfter) websiteService.saveBeforeAfter(homepageData.beforeAfter);
      if (homepageData.testimonials) websiteService.saveTestimonials(homepageData.testimonials);
      if (homepageData.gallery) websiteService.saveGallery(homepageData.gallery);
      if (homepageData.blogs) websiteService.saveBlogs(homepageData.blogs);
      if (homepageData.contact) websiteService.saveContact(homepageData.contact);
      if (homepageData.footer) websiteService.saveFooter(homepageData.footer);

      setIsSaving(false);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastPublishedTime(`Today at ${nowStr}`);
      if (triggerToast) {
        triggerToast("Homepage content published live successfully!", "success");
      }
    }, 500);
  };

  const handleSaveHeroSection = async () => {
    try {
      const heroPayload = {
        trustBadge: homepageData.hero?.trustBadge || homepageData.hero?.badge || "Trusted Dental Clinic",
        heading: homepageData.hero?.title || homepageData.hero?.heading || "Expert Dental Care",
        accentSubheading: homepageData.hero?.accentSubheading || "Modern Dentistry & Laser Treatments",
        description: homepageData.hero?.subtitle || homepageData.hero?.description || "Painless laser dental treatments.",
        stats: (homepageData.statCards || []).slice(0, 4).map(s => ({
          value: s.number || "",
          title: s.label || "",
          subtitle: s.description || ""
        }))
      };
      await heroService.updateHeroContent(heroPayload);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastPublishedTime(`Today at ${nowStr}`);
      if (triggerToast) {
        triggerToast("Hero section saved and published live successfully!", "success");
      }
    } catch (err) {
      console.error("Save Hero Section Error:", err);
      if (triggerToast) {
        triggerToast(err.message || "Failed to save Hero section.", "error");
      }
    }
  };

  const handleSaveAboutSection = async () => {
    try {
      const aboutPayload = {
        heading: homepageData.aboutPreview?.heading || homepageData.aboutPreview?.title || "About Our Clinic",
        description: homepageData.aboutPreview?.description || homepageData.aboutPreview?.subtitle || "Comprehensive dental care."
      };
      await aboutService.updateAboutContent(aboutPayload);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastPublishedTime(`Today at ${nowStr}`);
      if (triggerToast) {
        triggerToast("About section saved and published live successfully!", "success");
      }
    } catch (err) {
      console.error("Save About Section Error:", err);
      if (triggerToast) {
        triggerToast(err.message || "Failed to save About section.", "error");
      }
    }
  };

  const handleSaveDraftSection = (sectionName) => {
    if (triggerToast) {
      triggerToast(`Draft saved for ${sectionName.toUpperCase()} section.`, "success");
    }
  };

  const handleTriggerPreview = (sectionId) => {
    setPreviewSectionId(sectionId);
    setIsPreviewOpen(true);
  };

  const handleSimulatedImageUpload = (category, field) => {
    const fakeImages = [
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600"
    ];
    const randomImg = fakeImages[Math.floor(Math.random() * fakeImages.length)];
    if (category && field) {
      handleDataChange(category, field, randomImg);
    }
  };

  // Stat Card Handlers
  const handleOpenAddStatModal = () => {
    setEditingStatCard(null);
    setStatForm({
      id: `stat-${Date.now()}`,
      icon: "award",
      number: "1,000+",
      label: "Successful Treatments",
      description: "Painless laser procedures completed.",
      enabled: true
    });
    setIsStatModalOpen(true);
  };

  const handleOpenEditStatModal = (card) => {
    setEditingStatCard(card);
    setStatForm({ ...card });
    setIsStatModalOpen(true);
  };

  const handleSaveStatModal = (e) => {
    e.preventDefault();
    const currentStats = homepageData.statCards || [];
    let updated;
    if (editingStatCard) {
      updated = currentStats.map((s) => (s.id === statForm.id ? statForm : s));
    } else {
      updated = [...currentStats, statForm];
    }
    handleDataChange("statCards", null, updated);
    setIsStatModalOpen(false);
    if (triggerToast) triggerToast("Statistics card saved!", "success");
  };

  const handleDeleteStatCard = (id) => {
    const updated = (homepageData.statCards || []).filter((s) => s.id !== id);
    handleDataChange("statCards", null, updated);
    if (triggerToast) triggerToast("Statistics card deleted.", "success");
  };

  const handleToggleStatEnable = (id) => {
    const updated = (homepageData.statCards || []).map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    handleDataChange("statCards", null, updated);
  };

  const hero = homepageData.hero || {};
  const statCards = Array.isArray(homepageData.statCards) ? homepageData.statCards : [];
  const aboutPreview = homepageData.aboutPreview || {};
  const appointmentCta = homepageData.appointmentCta || {};
  const treatments = Array.isArray(homepageData.treatments) ? homepageData.treatments : [];
  const doctors = Array.isArray(homepageData.doctors) ? homepageData.doctors : [];
  const beforeAfter = Array.isArray(homepageData.beforeAfter) ? homepageData.beforeAfter : [];
  const testimonials = Array.isArray(homepageData.testimonials) ? homepageData.testimonials : [];
  const gallery = Array.isArray(homepageData.gallery) ? homepageData.gallery : [];
  const blogs = Array.isArray(homepageData.blogs) ? homepageData.blogs : [];
  const contact = homepageData.contact || {};
  const footer = homepageData.footer || {};

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] font-sans select-none overflow-y-auto custom-scrollbar">
      
      {/* Main Content-First Accordion Workspace */}
      <div className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6 pb-20">

        {/* 1. HERO SECTION & HERO STATISTICS CARDS */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div
            onClick={() => toggleSection("hero")}
            className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold">
                <Home className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Hero Section
                </h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">
                  Trust Badge • Main Heading • Subtitle • CTA Buttons • Statistics Cards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Published
              </span>
              {expandedSections.hero ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          {expandedSections.hero && (
            <div className="p-6 space-y-6 bg-white animate-fade-in">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase text-[#0E2A6D] block">Hero Content</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Trust Badge</label>
                    <input type="text" value={safeVal(hero.trustBadge)} onChange={(e) => handleDataChange("hero", "trustBadge", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Main Heading</label>
                    <input type="text" value={safeVal(hero.title)} onChange={(e) => handleDataChange("hero", "title", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-900 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Description</label>
                  <textarea rows={3} value={safeVal(hero.subtitle)} onChange={(e) => handleDataChange("hero", "subtitle", e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold text-[#0E2A6D] uppercase block">Primary CTA Button</span>
                    <input type="text" placeholder="Button Text" value={safeVal(hero.primaryCtaText)} onChange={(e) => handleDataChange("hero", "primaryCtaText", e.target.value)} className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none" />
                    <input type="text" placeholder="Button Link" value={safeVal(hero.primaryCtaLink, "/appointment")} onChange={(e) => handleDataChange("hero", "primaryCtaLink", e.target.value)} className="w-full h-8 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-slate-500 outline-none" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold text-slate-600 uppercase block">Secondary CTA Button</span>
                    <input type="text" placeholder="Button Text" value={safeVal(hero.secondaryCtaText)} onChange={(e) => handleDataChange("hero", "secondaryCtaText", e.target.value)} className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none" />
                    <input type="text" placeholder="Button Link" value={safeVal(hero.secondaryCtaLink, "/treatments")} onChange={(e) => handleDataChange("hero", "secondaryCtaLink", e.target.value)} className="w-full h-8 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-slate-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* STATS CARDS MANAGER */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase text-[#0E2A6D] block">Hero Statistics Cards</span>
                    <p className="text-[11px] text-slate-400 font-medium">Add, edit, reorder, or toggle statistics cards on the homepage.</p>
                  </div>
                  <button type="button" onClick={handleOpenAddStatModal} className="px-3.5 h-8.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs outline-none transition-all duration-200 active:scale-98"><Plus className="w-3.5 h-3.5" /><span>Add Stat Card</span></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {statCards.map((card, idx) => (
                    <div key={card.id || idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#0E2A6D]">{card.number}</span>
                            <span className="text-xs font-bold text-slate-800">{card.label}</span>
                          </div>
                          {card.description && <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{card.description}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleToggleStatEnable(card.id)} className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${card.enabled ? "bg-emerald-50 text-[#16A34A] border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>{card.enabled ? "ENABLED" : "HIDDEN"}</button>
                        <button type="button" onClick={() => handleOpenEditStatModal(card)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => handleDeleteStatCard(card.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("hero")} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveHeroSection} className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs cursor-pointer transition-all duration-200 outline-none active:scale-98">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. ABOUT PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("about")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><Info className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">About Preview</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Heading • Description • CTA Button Text & Link</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Published
              </span>
              {expandedSections.about ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.about && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Heading</label>
                <input type="text" value={safeVal(aboutPreview.heading)} onChange={(e) => handleDataChange("aboutPreview", "heading", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Description</label>
                <textarea rows={3} value={safeVal(aboutPreview.description)} onChange={(e) => handleDataChange("aboutPreview", "description", e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">CTA Button Text</label>
                  <input type="text" value={safeVal(aboutPreview.buttonText, "Read Our Story")} onChange={(e) => handleDataChange("aboutPreview", "buttonText", e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">CTA Button Link</label>
                  <input type="text" value={safeVal(aboutPreview.buttonLink, "/about")} onChange={(e) => handleDataChange("aboutPreview", "buttonLink", e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("about")} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAboutSection} className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs transition-all duration-200 cursor-pointer outline-none active:scale-98">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. FEATURED TREATMENTS PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("treatments")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Featured Treatments</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Treatment Cards • WebP Image Upload • 1–6 Reorder • Display Toggles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {treatments.length} Featured Treatments
              </span>
              {expandedSections.treatments ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          {expandedSections.treatments && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              
              {/* Simple Rule Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0E2A6D] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">WebP Only</span>
                  <span>Max <strong>2 MB</strong> • Recommended: <strong>1200 × 900 px</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDataChange("treatments", null, [...treatments, { id: `trt-${Date.now()}`, name: "New Treatment", shortDesc: "Treatment short description", image: "/assets/images/treatments/laser-root-canal.webp", displayOnHomepage: true, order: treatments.length + 1 }])}
                  className="px-3.5 h-8.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all duration-200 outline-none active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add Treatment</span>
                </button>
              </div>

              {/* Drag and Drop 6 Treatments List */}
              <div className="space-y-3">
                {treatments.map((trt, idx) => {
                  const isDragging = draggedItem?.sectionKey === "treatments" && draggedItem?.index === idx;
                  const isDragOver = dragOverIdx === idx && draggedItem?.sectionKey === "treatments" && draggedItem?.index !== idx;

                  return (
                    <div
                      key={trt.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx, "treatments")}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx, "treatments")}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 rounded-2xl bg-white border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all ${
                        isDragging ? "opacity-30 border-dashed border-[#0E2A6D]" : "border-slate-200"
                      } ${
                        isDragOver ? "border-[#0E2A6D] bg-slate-50 ring-2 ring-[#0E2A6D]/20 scale-[1.01]" : "hover:border-slate-300"
                      }`}
                    >
                      {/* Left: Drag Handle, Position Badge, Thumbnail & Title/Desc Inputs */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        
                        {/* Drag Handle Icon */}
                        <div
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0E2A6D] hover:bg-slate-100 cursor-grab active:cursor-grabbing flex-shrink-0"
                          title="Drag to reorder position"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Automatic Read-only Sequential Position Badge */}
                        <span className="w-6.5 h-6.5 rounded-full bg-[#0E2A6D] text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 shadow-xs">
                          {idx + 1}
                        </span>

                        {/* WebP Image Thumbnail */}
                        <img
                          src={trt.image || "/assets/images/treatments/laser-root-canal.webp"}
                          alt={trt.name}
                          className="w-16 h-12 object-cover rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300";
                          }}
                        />

                        {/* Treatment Name & Description Inputs */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <input
                            type="text"
                            value={safeVal(trt.name)}
                            onChange={(e) => handleDataChange("treatments", null, treatments.map(t => t.id === trt.id ? { ...t, name: e.target.value } : t))}
                            className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-extrabold text-slate-900 outline-none w-full max-w-sm focus:border-[#0E2A6D]"
                            placeholder="Treatment Name"
                          />
                          <input
                            type="text"
                            value={safeVal(trt.shortDesc)}
                            onChange={(e) => handleDataChange("treatments", null, treatments.map(t => t.id === trt.id ? { ...t, shortDesc: e.target.value } : t))}
                            className="h-7.5 rounded-lg border border-slate-200 px-2.5 text-[11px] font-medium text-slate-600 outline-none w-full max-w-md focus:border-[#0E2A6D]"
                            placeholder="Short description..."
                          />
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                        <label className="px-3 h-8 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:border-[#0E2A6D] hover:text-[#0E2A6D] transition-all flex items-center gap-1.5 bg-slate-50 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#0E2A6D]" />
                          <span>Replace WebP</span>
                          <input
                            type="file"
                            accept=".webp"
                            className="hidden"
                            onChange={(e) => handleTreatmentWebPUpload(trt.id, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDataChange("treatments", null, treatments.map(t => t.id === trt.id ? { ...t, displayOnHomepage: t.displayOnHomepage === false ? true : false } : t))}
                          className={`px-2.5 h-8 rounded-xl text-xs font-extrabold cursor-pointer border ${
                            trt.displayOnHomepage !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          {trt.displayOnHomepage !== false ? "HOMEPAGE: YES" : "HOMEPAGE: NO"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDataChange("treatments", null, treatments.filter(t => t.id !== trt.id))}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("treatments")} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs transition-all duration-200 cursor-pointer outline-none active:scale-98">Publish</button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 4. FEATURED DOCTOR PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("doctors")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Featured Doctor</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Dr. K. Ravindra Babu • Chief Endodontist (Homepage + Doctors Page)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-50 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                1 Featured Doctor
              </span>
              {expandedSections.doctors ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          {expandedSections.doctors && (
            <div className="p-6 space-y-5 bg-white animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row gap-5 items-start">
                
                {/* Fixed Profile Image */}
                <div className="flex flex-col items-center justify-center space-y-2 flex-shrink-0">
                  <img
                    src="/assets/images/doctors/dr-ravindra-babu.webp"
                    alt="Dr. K. Ravindra Babu"
                    className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs bg-white"
                  />
                  <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    🔒 Image Fixed
                  </span>
                </div>

                {/* Editable Fields */}
                <div className="min-w-0 flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Doctor Name</label>
                    <input
                      type="text"
                      value={safeVal(homepageData.doctors?.[0]?.name, "Dr. K. Ravindra Babu")}
                      onChange={(e) => handleDataChange("doctors", null, [{ ...(homepageData.doctors?.[0] || {}), name: e.target.value }])}
                      className="h-8.5 rounded-lg border border-slate-200 px-2.5 text-xs font-extrabold text-slate-900 outline-none w-full max-w-md focus:border-[#0E2A6D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Qualification</label>
                      <input
                        type="text"
                        value={safeVal(homepageData.doctors?.[0]?.qualification, "BDS, MDS – Conservative Dentistry & Endodontics")}
                        onChange={(e) => handleDataChange("doctors", null, [{ ...(homepageData.doctors?.[0] || {}), qualification: e.target.value }])}
                        className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-800 outline-none w-full focus:border-[#0E2A6D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Designation / Specialization</label>
                      <input
                        type="text"
                        value={safeVal(homepageData.doctors?.[0]?.designation, "Chief Endodontist & Laser Root Canal Specialist")}
                        onChange={(e) => handleDataChange("doctors", null, [{ ...(homepageData.doctors?.[0] || {}), designation: e.target.value }])}
                        className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-800 outline-none w-full focus:border-[#0E2A6D]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("doctors")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. BEFORE & AFTER PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("before_after")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><Split className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Before & After Preview</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Before & After Pairs • Treatment Names • Homepage Toggles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">{beforeAfter.length} Before & After Cases</span>
              {expandedSections.before_after ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.before_after && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div className="space-y-3">
                {beforeAfter.map((caseItem, idx) => {
                  const isDragging = draggedItem?.sectionKey === "beforeAfter" && draggedItem?.index === idx;
                  const isDragOver = dragOverIdx === idx && draggedItem?.sectionKey === "beforeAfter" && draggedItem?.index !== idx;

                  return (
                    <div
                      key={caseItem.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx, "beforeAfter")}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx, "beforeAfter")}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 rounded-2xl bg-white border shadow-xs flex items-center justify-between gap-4 transition-all ${
                        isDragging ? "opacity-30 border-dashed border-[#0E2A6D]" : "border-slate-200"
                      } ${
                        isDragOver ? "border-[#0E2A6D] bg-slate-50 ring-2 ring-[#0E2A6D]/20 scale-[1.01]" : "hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-1 rounded text-slate-400 hover:text-[#0E2A6D] cursor-grab active:cursor-grabbing flex-shrink-0" title="Drag to reorder">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#0E2A6D] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <img src={caseItem.beforeImg} alt="Before" className="w-12 h-10 object-cover rounded-lg border border-slate-200" />
                        <img src={caseItem.afterImg} alt="After" className="w-12 h-10 object-cover rounded-lg border border-slate-200" />
                        <div className="min-w-0 flex-1">
                          <input type="text" value={safeVal(caseItem.treatment)} onChange={(e) => handleDataChange("beforeAfter", null, beforeAfter.map(c => c.id === caseItem.id ? { ...c, treatment: e.target.value } : c))} className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-extrabold text-slate-900 outline-none w-full max-w-sm" />
                        </div>
                      </div>
                      <button type="button" onClick={() => handleDataChange("beforeAfter", null, beforeAfter.map(c => c.id === caseItem.id ? { ...c, displayOnHomepage: !c.displayOnHomepage } : c))} className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${caseItem.displayOnHomepage ? "bg-emerald-50 text-[#16A34A] border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>
                        {caseItem.displayOnHomepage ? "HOMEPAGE: YES" : "HOMEPAGE: NO"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("before_after")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. PATIENT REVIEWS PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("testimonials")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><MessageSquare className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Patient Reviews</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Patient Names • Ratings • Reviews • Homepage Order</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">{testimonials.length} Patient Reviews</span>
              {expandedSections.testimonials ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.testimonials && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div className="space-y-3">
                {testimonials.map((rev, idx) => {
                  const isDragging = draggedItem?.sectionKey === "testimonials" && draggedItem?.index === idx;
                  const isDragOver = dragOverIdx === idx && draggedItem?.sectionKey === "testimonials" && draggedItem?.index !== idx;

                  return (
                    <div
                      key={rev.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx, "testimonials")}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx, "testimonials")}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 rounded-2xl bg-white border shadow-xs flex items-center justify-between gap-4 transition-all ${
                        isDragging ? "opacity-30 border-dashed border-[#0E2A6D]" : "border-slate-200"
                      } ${
                        isDragOver ? "border-[#0E2A6D] bg-slate-50 ring-2 ring-[#0E2A6D]/20 scale-[1.01]" : "hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-1 rounded text-slate-400 hover:text-[#0E2A6D] cursor-grab active:cursor-grabbing flex-shrink-0" title="Drag to reorder">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#0E2A6D] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <input type="text" value={safeVal(rev.patientName)} onChange={(e) => handleDataChange("testimonials", null, testimonials.map(t => t.id === rev.id ? { ...t, patientName: e.target.value } : t))} className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-extrabold text-[#0E2A6D] outline-none w-full max-w-sm" />
                          <input type="text" value={safeVal(rev.review)} onChange={(e) => handleDataChange("testimonials", null, testimonials.map(t => t.id === rev.id ? { ...t, review: e.target.value } : t))} className="h-7 rounded-lg border border-slate-200 px-2.5 text-[11px] font-medium text-slate-600 outline-none w-full mt-1" />
                        </div>
                      </div>
                      <button type="button" onClick={() => handleDataChange("testimonials", null, testimonials.filter(t => t.id !== rev.id))} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("testimonials")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. GALLERY PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("gallery")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><ImageIcon className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Gallery</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Facility Photos • Camp Images • Homepage Order</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">{gallery.length} Gallery Photos</span>
              {expandedSections.gallery ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.gallery && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div className="space-y-3">
                {gallery.map((gal, idx) => {
                  const isDragging = draggedItem?.sectionKey === "gallery" && draggedItem?.index === idx;
                  const isDragOver = dragOverIdx === idx && draggedItem?.sectionKey === "gallery" && draggedItem?.index !== idx;

                  return (
                    <div
                      key={gal.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx, "gallery")}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx, "gallery")}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 rounded-2xl bg-white border shadow-xs flex items-center justify-between gap-4 transition-all ${
                        isDragging ? "opacity-30 border-dashed border-[#0E2A6D]" : "border-slate-200"
                      } ${
                        isDragOver ? "border-[#0E2A6D] bg-slate-50 ring-2 ring-[#0E2A6D]/20 scale-[1.01]" : "hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-1 rounded text-slate-400 hover:text-[#0E2A6D] cursor-grab active:cursor-grabbing flex-shrink-0" title="Drag to reorder">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#0E2A6D] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <img src={gal.url} alt={gal.name} className="w-12 h-10 object-cover rounded-lg border border-slate-200" />
                        <input type="text" value={safeVal(gal.name)} onChange={(e) => handleDataChange("gallery", null, gallery.map(g => g.id === gal.id ? { ...g, name: e.target.value } : g))} className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-extrabold text-slate-900 outline-none w-full max-w-sm" />
                      </div>
                      <button type="button" onClick={() => handleDataChange("gallery", null, gallery.filter(g => g.id !== gal.id))} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("gallery")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 8. LATEST BLOGS PREVIEW (WITH INLINE BLOG CARD PREVIEW) */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("blogs")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><FileText className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Latest Blogs</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Blog Titles • Excerpts • Card Image Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">2 Published Blogs</span>
              {expandedSections.blogs ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.blogs && (
            <div className="p-6 space-y-6 bg-white animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase text-[#0E2A6D]">Blog Writer Form</h4>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Blog Title</label>
                    <input type="text" value={editingBlog.title} onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Summary Excerpt</label>
                    <textarea rows={3} value={editingBlog.summary} onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Pin className="w-3.5 h-3.5 text-[#0E2A6D]" /> Pin Blog on Homepage</span>
                    <button type="button" onClick={() => setEditingBlog({ ...editingBlog, isPinned: !editingBlog.isPinned })} className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer ${editingBlog.isPinned ? "bg-[#0E2A6D] text-white" : "bg-slate-200 text-slate-500"}`}>
                      {editingBlog.isPinned ? "PINNED" : "NORMAL"}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#0E2A6D] flex items-center gap-1 mb-2"><Sparkles className="w-3.5 h-3.5 text-[#0E2A6D]" /> Live Blog Card Preview</span>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex gap-3.5">
                      <img src={editingBlog.cardImage} alt="Blog Card Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h5 className="text-xs font-extrabold text-slate-900 truncate">{editingBlog.title || "Untitled Blog Post"}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{editingBlog.summary || "Short article summary preview."}</p>
                        <div className="text-[9px] font-bold text-[#0E2A6D] pt-1">{editingBlog.publishDate} • {editingBlog.readTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("blogs")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 9. APPOINTMENT CTA */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("appointmentCta")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><Calendar className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Appointment CTA</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Heading • Description • Primary & Secondary CTAs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Published
              </span>
              {expandedSections.appointmentCta ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.appointmentCta && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Heading</label>
                <input type="text" value={safeVal(appointmentCta.heading)} onChange={(e) => handleDataChange("appointmentCta", "heading", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Description</label>
                <textarea rows={2} value={safeVal(appointmentCta.description)} onChange={(e) => handleDataChange("appointmentCta", "description", e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Primary Button Text</label>
                  <input type="text" value={safeVal(appointmentCta.primaryButtonText, "Book Your Visit Now")} onChange={(e) => handleDataChange("appointmentCta", "primaryButtonText", e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Primary Button Link</label>
                  <input type="text" value={safeVal(appointmentCta.primaryButtonLink, "/appointment")} onChange={(e) => handleDataChange("appointmentCta", "primaryButtonLink", e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("appointmentCta")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10. CONTACT US PREVIEW */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("contact")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><PhoneCall className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Contact Us</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Address • Phone Numbers • Email • Google Maps Link</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Published
              </span>
              {expandedSections.contact ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.contact && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Clinic Address</label>
                  <input type="text" value={safeVal(contact.address)} onChange={(e) => handleDataChange("contact", "address", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                  <input type="text" value={safeVal(contact.phone)} onChange={(e) => handleDataChange("contact", "phone", e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("contact")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 11. FOOTER */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          <div onClick={() => toggleSection("footer")} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 cursor-pointer border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold"><LayoutTemplate className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Footer</h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">Description • Navigation Links • Social Links • Copyright</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Published
              </span>
              {expandedSections.footer ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          {expandedSections.footer && (
            <div className="p-6 space-y-4 bg-white animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Footer Description</label>
                <textarea rows={2} value={safeVal(footer.shortDesc)} onChange={(e) => handleDataChange("footer", "shortDesc", e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => handleSaveDraftSection("footer")} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Save Draft</button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">Publish</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ADD / EDIT STAT CARD MODAL */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingStatCard ? "Edit Statistics Card" : "Add Statistics Card"}
              </h3>
              <button onClick={() => setIsStatModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatModal} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Icon</label>
                <select
                  value={statForm.icon}
                  onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="users">Users (Happy Patients)</option>
                  <option value="calendar">Calendar (Years Experience)</option>
                  <option value="award">Award (Success Rate)</option>
                  <option value="star">Star (Google Rating)</option>
                  <option value="stethoscope">Stethoscope (Treatments)</option>
                  <option value="sparkles">Sparkles (Specialty)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Number / Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25,000+"
                  value={statForm.number}
                  onChange={(e) => setStatForm({ ...statForm, number: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Happy Patients"
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Short Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Patients treated with quality care."
                  value={statForm.description}
                  onChange={(e) => setStatForm({ ...statForm, description: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Show / Hide Card</span>
                <button
                  type="button"
                  onClick={() => setStatForm({ ...statForm, enabled: !statForm.enabled })}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    statForm.enabled ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {statForm.enabled ? "ENABLED" : "HIDDEN"}
                </button>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Stat Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TREATMENT WEBP IMAGE PREVIEW LIGHTBOX MODAL */}
      {treatmentImagePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {treatmentImagePreviewModal.title} — WebP Image Preview
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1 inline-block">
                  ✓ WebP Format Verified • Recommended 1200×900 px
                </span>
              </div>
              <button onClick={() => setTreatmentImagePreviewModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 flex items-center justify-center p-2">
              <img
                src={treatmentImagePreviewModal.url}
                alt={treatmentImagePreviewModal.title}
                className="max-h-[380px] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setTreatmentImagePreviewModal(null)}
                className="px-5 h-9 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold cursor-pointer hover:bg-[#16398b]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* On-Demand Responsive Preview Drawer */}
      <HomepagePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        selectedSectionId={previewSectionId}
        homepageData={homepageData}
      />

    </div>
  );
}
