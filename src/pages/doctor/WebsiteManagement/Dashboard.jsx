import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  UserCheck, 
  Stethoscope, 
  Activity, 
  ArrowRight,
  Plus,
  Edit3
} from "lucide-react";
import websiteService from "../../../services/websiteService";

export default function WebsiteDashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setStats(websiteService.getDashboardStats());
    setActivities(websiteService.getActivities());
  }, []);

  if (!stats) return null;

  const quickActions = [
    { name: "Edit Homepage", desc: "Update hero, banner & text sections", path: "/doctor/website-management/homepage", icon: Edit3, color: "bg-[#EFF6FF] text-[#2563EB]" },
    { name: "Publish New Blog", desc: "Write & publish patient education articles", path: "/doctor/website-management/blogs", icon: FileText, color: "bg-[#F0FDF4] text-[#16A34A]" },
    { name: "Upload Gallery Photos", desc: "Add clinic photos & camp event shots", path: "/doctor/website-management/gallery", icon: ImageIcon, color: "bg-indigo-50 text-indigo-600" },
    { name: "Manage Testimonials", desc: "Review & publish patient feedback", path: "/doctor/website-management/testimonials", icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
    { name: "Update Doctors Profile", desc: "Edit specialist bio & qualifications", path: "/doctor/website-management/doctors", icon: UserCheck, color: "bg-[#FEF3C7] text-[#D97706]" },
    { name: "Manage Treatments", desc: "Add or modify procedure details", path: "/doctor/website-management/treatments", icon: Stethoscope, color: "bg-teal-50 text-teal-600" }
  ];

  return (
    <div className="space-y-6 select-none font-sans w-full pb-12">
      {/* Overview Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website Pages</span>
          <p className="text-xl font-extrabold text-[#2563EB] mt-1">{stats.totalPages} Pages</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Public CMS</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Published Blogs</span>
          <p className="text-xl font-extrabold text-[#16A34A] mt-1">{stats.publishedBlogs} Articles</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Live Posts</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gallery Images</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-1">{stats.galleryImages} Photos</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Clinic Media</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Testimonials</span>
          <p className="text-xl font-extrabold text-purple-600 mt-1">{stats.testimonials} Reviews</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Patient Reviews</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Doctors</span>
          <p className="text-xl font-extrabold text-[#D97706] mt-1">{stats.activeDoctors} Doctor</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Specialist Profile</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatments</span>
          <p className="text-xl font-extrabold text-teal-600 mt-1">{stats.treatments} Services</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Procedures Listed</p>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2563EB]" />
          Quick CMS Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.path}
                className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-[#2563EB] transition-colors">{action.name}</h4>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Website Activity Log Table */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              Recent Website Activity Log
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Audit log of recent CMS changes and content updates</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                <th className="py-3 px-4 rounded-tl-xl">Date & Time</th>
                <th className="py-3 px-4">Website Section</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4 rounded-tr-xl">Updated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs font-semibold text-slate-700">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-medium">{act.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[10px]">
                      {act.section}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{act.action}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{act.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
