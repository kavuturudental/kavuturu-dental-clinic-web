// src/pages/receptionist/Profile.jsx

import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../components/receptionist/layout/DashboardLayout";
import Input from "../../components/receptionist/common/Input";
import { Lock, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ReceptionistContext } from "../../contexts/ReceptionistContext";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { receptionistName, updateName } = useContext(ReceptionistContext);

  const [savingProfile, setSavingProfile] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || receptionistName || "Clinic Receptionist",
    email: user?.email || "receptionist@kavuturudental.com",
    phone: user?.phone || "+91 98480 99999",
    gender: "Female",
    title: "Receptionist",
    clinicName: "Kavuturu Dental Clinic"
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.fullName.trim()) {
      toast.error("Receptionist Display Name is required!");
      return;
    }

    setSavingProfile(true);

    try {
      const res = await authService.updateProfile({
        name: profile.fullName.trim(),
      });

      if (res.success) {
        if (res.data) {
          updateUser(res.data);
        }
        if (updateName) {
          updateName(profile.fullName.trim());
        }
        toast.success("Receptionist display name saved successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save display name.";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetProfile = () => {
    setProfile((prev) => ({
      ...prev,
      fullName: user?.name || "Clinic Receptionist",
      email: user?.email || "receptionist@kavuturudental.com",
      phone: user?.phone || "+91 98480 99999",
      gender: "Female"
    }));
    toast("Changes reset", { icon: "ℹ️" });
  };

  return (
    <DashboardLayout>
      <div className="p-1 space-y-2.5 max-w-[1000px] mx-auto font-sans select-none">
        
        {/* ====================================================
            SECTION 1: PROFILE SUMMARY
        ==================================================== */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
          
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-2xs select-none">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "R"}
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {profile.fullName}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {profile.title}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Active
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mt-4 pt-4 border-t border-slate-100 w-full max-w-xs text-center">
            {profile.clinicName}
          </p>

        </div>

        {/* ====================================================
            SECTION 2: PROFILE INFORMATION (ROLE RESTRICTED)
        ==================================================== */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Receptionist Profile
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              You can edit your portal display name. Primary email and phone number are managed strictly by the Doctor.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* 1. Receptionist Display Name (Editable) */}
              <div className="space-y-1.5 w-full">
                <label className="block text-[11px] font-semibold text-slate-700 tracking-tight uppercase">
                  Receptionist Display Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  required
                  placeholder="Enter display name"
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              {/* 2. Gender */}
              <div className="space-y-1.5 w-full">
                <label className="block text-[11px] font-semibold text-slate-500 tracking-tight uppercase">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 3. Email Address (Disabled / Read-only) */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-500 tracking-tight uppercase">
                    Email Address (Read-Only)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                    <Lock className="w-3 h-3 text-amber-600" /> Managed by Doctor
                  </span>
                </div>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="h-10 w-full rounded-2xl border border-slate-200/90 bg-slate-100/80 px-4 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none select-none"
                />
              </div>

              {/* 4. Phone Number (Disabled / Read-only) */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-500 tracking-tight uppercase">
                    Phone Number (Read-Only)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                    <Lock className="w-3 h-3 text-amber-600" /> Managed by Doctor
                  </span>
                </div>
                <input
                  type="text"
                  value={profile.phone}
                  disabled
                  className="h-10 w-full rounded-2xl border border-slate-200/90 bg-slate-100/80 px-4 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none select-none"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetProfile}
                className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : null}
                <span>{savingProfile ? "Saving..." : "Save Display Name"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
