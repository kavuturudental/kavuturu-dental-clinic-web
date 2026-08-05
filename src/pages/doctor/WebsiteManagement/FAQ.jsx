// src/pages/doctor/WebsiteManagement/FAQ.jsx

import React, { useState } from "react";
import { HelpCircle, Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_FAQS = [
  { id: "1", question: "What are clinic operating hours?", answer: "Monday to Saturday from 9:30 AM to 8:30 PM. Sunday by appointment only.", category: "General", status: "Active" },
  { id: "2", question: "Is Root Canal Treatment painful?", answer: "No, modern RCT is performed under local anesthesia and is completely painless.", category: "Root Canal", status: "Active" },
  { id: "3", question: "How long do dental implants last?", answer: "With proper oral hygiene and regular checkups, implants can last a lifetime.", category: "Implants", status: "Active" }
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");

  const openAddModal = () => {
    setEditingItem(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category || "General");
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setFaqs(faqs.map((f) => (f.id === editingItem.id ? { ...f, question, answer, category } : f)));
    } else {
      setFaqs([...faqs, { id: String(Date.now()), question, answer, category, status: "Active" }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* TOP ACTION ROW */}
      <div className="flex items-center justify-end">
        <button
          onClick={openAddModal}
          className="h-9.5 px-4.5 rounded-xl text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQ Items List */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                <th className="py-3.5 px-6">Question</th>
                <th className="py-3.5 px-6">Answer</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs font-semibold text-slate-700">
              {faqs.map((f) => (
                <tr key={f.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6 font-extrabold text-slate-800 max-w-xs">{f.question}</td>
                  <td className="py-3.5 px-6 text-slate-500 font-medium max-w-sm truncate">{f.answer}</td>

                  <td className="py-3.5 px-6 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                      f.status === "Active" ? "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]" : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {f.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(f)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#F59E0B] hover:bg-amber-50 transition-colors cursor-pointer" title="Edit FAQ">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer" title="Delete FAQ">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 space-y-4">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
              
              <h3 className="text-lg font-extrabold text-[#2563EB] tracking-tight">{editingItem ? "Edit FAQ" : "Add FAQ"}</h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Question *</label>
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB]" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Answer</label>
                  <textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB]" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB]">
                    <option value="General">General</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Implants">Implants</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-9.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-xs font-bold text-slate-600 transition-all cursor-pointer outline-none">Cancel</button>
                  <button type="submit" className="flex-1 h-9.5 rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-xs font-bold transition-all cursor-pointer shadow-2xs outline-none">Save FAQ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative bg-white w-full max-w-md rounded-[24px] border border-slate-100 shadow-2xl p-6 select-none z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-100"><AlertTriangle className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Delete FAQ</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Are you sure you want to remove this question?</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setDeleteId(null)} className="flex-1 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-600 hover:bg-[#F8FAFC]">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 h-9.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-2xs">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
