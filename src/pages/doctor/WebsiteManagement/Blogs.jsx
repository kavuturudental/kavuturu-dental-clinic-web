// src/pages/doctor/WebsiteManagement/Blogs.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Upload, 
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  HelpCircle,
  Eye,
  ArrowLeft,
  User
} from "lucide-react";
import blogService from "../../../services/website/blogService";
import RichTextEditor from "../../../components/doctor/website/RichTextEditor";

export default function BlogsCMS() {
  const { triggerToast } = useOutletContext() || {};

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Screen View Mode: "list" | "editor" | "preview"
  const [viewMode, setViewMode] = useState("list");

  // Modals State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Dental Care",
    readTime: "5 min read",
    summary: "",
    content: "",
    image: "",
    blogDate: new Date().toISOString().split("T")[0],
    faqs: [],
    status: "Active"
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogService.getBlogs();
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      if (triggerToast) triggerToast("Failed to load blog articles.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Compact Image Upload Handler (WEBP, 1 MB max size, 1280x720 min resolution)
  const handleImageUpload = (file) => {
    if (!file) return;

    // 1. File Size Validation (Max 1 MB = 1,048,576 bytes)
    const MAX_SIZE_BYTES = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      if (triggerToast) {
        triggerToast("File Size Error: Maximum file size allowed is 1 MB.", "error");
      }
      return;
    }

    // 2. Strict WEBP format validation
    const isWebpExtension = file.name.toLowerCase().endsWith(".webp");
    const isWebpMime = file.type === "image/webp";

    if (!isWebpExtension && !isWebpMime) {
      if (triggerToast) {
        triggerToast("Format Error: Only WEBP (.webp) images are allowed.", "error");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // 3. Minimum Resolution Check (1280 x 720 px)
        if (width < 1280 || height < 720) {
          if (triggerToast) {
            triggerToast(
              `Resolution Error: Image is ${width} × ${height} px. Minimum required resolution is 1280 × 720 px (16:9 aspect ratio). Recommended: 1600 × 900 px.`,
              "error"
            );
          }
          return;
        }

        setFormData(prev => ({ ...prev, image: result }));
        setImagePreview(result);

        if (triggerToast) {
          triggerToast(`WEBP Image verified successfully (${width} × ${height} px, 16:9 ratio)!`, "success");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const handleUpdateFaq = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.faqs];
      updated[index][field] = val;
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleOpenAdd = () => {
    // 15 Blog Capacity Limit Check
    if (blogs.length >= 15) {
      setIsLimitModalOpen(true);
      return;
    }

    setEditingItem(null);
    setFormData({
      title: "",
      category: "Dental Care",
      readTime: "5 min read",
      summary: "",
      content: "",
      image: "",
      blogDate: new Date().toISOString().split("T")[0],
      faqs: [],
      status: "Active"
    });
    setImagePreview("");
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    
    let formattedDate = new Date().toISOString().split("T")[0];
    if (item.blogDate) {
      formattedDate = new Date(item.blogDate).toISOString().split("T")[0];
    }

    setFormData({
      title: item.title || "",
      category: item.category || "Dental Care",
      readTime: item.readTime || "5 min read",
      summary: item.summary || "",
      content: item.content || "",
      image: item.image || "",
      blogDate: formattedDate,
      faqs: Array.isArray(item.faqs) ? item.faqs : [],
      status: item.status || "Active"
    });
    setImagePreview(item.image || "");
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleBackToEditor = () => {
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setViewMode("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDeleteModal = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title.trim()) {
      if (triggerToast) triggerToast("Blog Title is required.", "error");
      return;
    }
    if (formData.title.trim().length > 100) {
      if (triggerToast) triggerToast("Blog Title cannot exceed 100 characters.", "error");
      return;
    }
    if (!formData.summary.trim()) {
      if (triggerToast) triggerToast("Blog Summary is required.", "error");
      return;
    }
    if (!formData.content.trim()) {
      if (triggerToast) triggerToast("Blog Content is required.", "error");
      return;
    }
    if (!formData.image) {
      if (triggerToast) triggerToast("Featured Image is required.", "error");
      return;
    }
    if (!formData.blogDate) {
      if (triggerToast) triggerToast("Blog Date is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        readTime: formData.readTime.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        image: formData.image,
        blogDate: formData.blogDate,
        faqs: formData.faqs.filter(f => f.question.trim() && f.answer.trim()),
        status: formData.status
      };

      if (editingItem) {
        await blogService.updateBlog(editingItem._id || editingItem.id, payload);
        if (triggerToast) triggerToast("Blog article updated successfully!", "success");
      } else {
        await blogService.createBlog(payload);
        if (triggerToast) triggerToast("New Blog article created successfully!", "success");
      }

      setViewMode("list");
      loadBlogs();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to save blog article:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save blog article.";

      if (err.response?.data?.code === "LIMIT_REACHED") {
        setViewMode("list");
        setIsLimitModalOpen(true);
      } else {
        if (triggerToast) triggerToast(errMsg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await blogService.deleteBlog(deletingItem._id || deletingItem.id);
      if (triggerToast) triggerToast("Blog article deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadBlogs();
    } catch (err) {
      console.error("Failed to delete blog article:", err);
      if (triggerToast) triggerToast("Failed to delete blog article.", "error");
    } finally {
      setSubmitting(false);
      setDeletingItem(null);
    }
  };

  // =========================================================
  // VIEW MODE 1: DATA TABLE LIST VIEW
  // =========================================================
  if (viewMode === "list") {
    return (
      <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
        {/* TOP ACTION ROW */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200">
            Capacity: <strong className="text-[#2563EB]">{blogs.length} / 15</strong> Blogs
          </span>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Blog</span>
          </button>
        </div>

        {/* 2. TABLE VIEW */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-semibold">Loading blog articles...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Blog Articles Found</h3>
            <p className="text-xs text-slate-400">Click "Add Blog" to write your first dental article in the full-page editor.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Blog Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Reading Time</th>
                    <th className="py-3.5 px-4">Blog Date</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {blogs.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Title + Thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3 max-w-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <span className="font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                          {item.category || "Dental Care"}
                        </span>
                      </td>

                      {/* Reading Time */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.readTime || "5 min read"}
                        </span>
                      </td>

                      {/* Blog Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          {new Date(item.blogDate || item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIMIT MODAL */}
        {isLimitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900">Blog Limit Reached</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have reached the maximum limit of 15 blogs. Please edit or delete an existing blog before adding a new one.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLimitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => setIsLimitModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Manage Blogs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {isDeleteModalOpen && deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">Delete Blog Article</h3>
                <p className="text-xs text-slate-600">
                  Are you sure you want to delete this blog?
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{submitting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================
  // VIEW MODE 3: LIVE ARTICLE PREVIEW MODE
  // =========================================================
  if (viewMode === "preview") {
    const formattedPreviewDate = new Date(formData.blogDate || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return (
      <div className="space-y-6 font-sans w-full max-w-[1000px] mx-auto pb-16">
        
        {/* Sticky Preview Header Control Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-xs rounded-2xl">
          <button
            type="button"
            onClick={handleBackToEditor}
            className="px-4 h-9 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Editor</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Live Preview Mode
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 h-9 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{submitting ? "Publishing..." : editingItem ? "Save Changes" : "Publish Blog"}</span>
            </button>
          </div>
        </div>

        {/* Live Public Article Preview Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-8">
          
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                {formData.category || "Dental Care"}
              </span>
              <span className="text-xs font-semibold text-slate-500">{formattedPreviewDate}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">{formData.readTime || "5 min read"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-outfit">
              {formData.title || "Untitled Blog Article"}
            </h1>

            {/* Author Details with Profile Icon Badge (No Image) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-9 w-9 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] border border-[#0E2A6D]/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Ravindra Babu</p>
                <p className="text-[10px] font-medium text-slate-500">Chief Dental Surgeon</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {formData.image && (
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article HTML Content */}
          <div
            dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-slate-400 italic'>No content written yet.</p>" }}
            className="text-sm sm:text-base leading-relaxed text-slate-700 font-sans space-y-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_ol]:space-y-2 [&_li]:text-slate-700 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:bg-sky-50/60 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-sky-900 [&_a]:text-sky-600 [&_a]:underline [&_hr]:my-6 [&_hr]:border-slate-200"
          />

          {/* FAQs Preview */}
          {formData.faqs.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {formData.faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Q: {faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    );
  }

  // =========================================================
  // VIEW MODE 2: DEDICATED FULL-PAGE EDITOR VIEW (NO MODAL POPUP!)
  // =========================================================
  return (
    <div className="space-y-6 font-sans w-full max-w-[1280px] mx-auto pb-16">
      
      {/* Sticky Header Action Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-xs rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToList}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
            title="Back to Blogs List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#2563EB]" />
              {editingItem ? "Edit Blog Article" : "Add New Blog Article"}
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Full-Page Document Canvas Editor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 h-9 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
            <span>{submitting ? "Publishing..." : editingItem ? "Save Changes" : "Publish Blog"}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 text-xs">
        
        {/* Row 1: Title, Category, Reading Time, Blog Date */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Title */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Blog Title (Max 100 chars) *
              </label>
              <span className={`text-[10px] font-mono font-bold ${formData.title.length > 100 ? "text-red-600" : "text-slate-400"}`}>
                {formData.title.length} / 100
              </span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Modern Laser Dental Care Innovations"
              className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Blog Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              placeholder="e.g. Dental Care, Root Canal, etc."
              className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
            />
          </div>

          {/* Reading Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reading Time *
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
              required
              placeholder="e.g. 5 min read"
              className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
            />
          </div>

        </div>

        {/* Row 2: Blog Date, Summary, and Compact Image Uploader */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          <div className="space-y-4">
            {/* Blog Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blog Date *
              </label>
              <input
                type="date"
                value={formData.blogDate}
                onChange={(e) => setFormData(prev => ({ ...prev, blogDate: e.target.value }))}
                required
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white cursor-pointer"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blog Summary (150–250 chars) *
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                required
                placeholder="Brief article preview for Homepage & Blogs page..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-medium text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* COMPACT FEATURED IMAGE UPLOADER (h-32) */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Featured Image (.WEBP Only, 16:9, Max 1 MB) *
            </label>

            <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center p-2 overflow-hidden transition-all">
              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="h-full max-w-full object-contain rounded-xl" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(""); setFormData(p => ({ ...p, image: "" })); }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center gap-3 text-left p-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0E2A6D] flex items-center justify-center shrink-0 border border-sky-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0E2A6D] block">Upload WEBP Featured Image</span>
                    <span className="text-[10px] text-slate-400 block">WEBP format, 1600 × 900 px (16:9), max size 1 MB.</span>
                  </div>
                  <input
                    type="file"
                    accept=".webp,image/webp"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="p-2.5 bg-sky-50/80 border border-sky-200/80 rounded-xl flex items-center gap-2 text-[11px] text-slate-700">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span><strong>Recommended:</strong> WEBP format, 1600 × 900 px (16:9), maximum file size 1 MB.</span>
            </div>
          </div>

        </div>

        {/* FULL-PAGE CANVAS RICH TEXT EDITOR */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Full Blog Article Content (Document Canvas Editor) *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
            placeholder="Write your article using headings, bold, italic, underline, lists, blockquotes, and horizontal dividers..."
          />
        </div>

        {/* DYNAMIC FAQ SECTION */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0E2A6D]" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Frequently Asked Questions (FAQs)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="px-3 h-7 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          {formData.faqs.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No FAQs added yet. Click "Add FAQ" to append interactive Q&A blocks to this article.</p>
          ) : (
            <div className="space-y-3">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 relative group">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0E2A6D]">FAQ #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, "question", e.target.value)}
                    placeholder="e.g. Is a root canal treatment painful?"
                    className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />

                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, "answer", e.target.value)}
                    placeholder="e.g. Modern root canal treatment is performed under local anesthesia..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white leading-relaxed"
                  />

                </div>
              ))}
            </div>
          )}
        </div>

      </form>

    </div>
  );
}
