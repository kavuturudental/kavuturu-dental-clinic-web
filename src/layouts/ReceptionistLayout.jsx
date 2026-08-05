// src/layouts/ReceptionistLayout.jsx

import React, { useState } from "react";
import Sidebar from "../components/receptionist/layout/Sidebar";
import Topbar from "../components/receptionist/layout/Topbar";
import LogoutModal from "../components/receptionist/common/LogoutModal";

export default function ReceptionistLayout({ children, searchValue, onSearchChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex overflow-hidden font-sans select-none text-slate-800 p-3 gap-3">
      {/* Desktop Floating Curved Sidebar - Perfectly Top-Aligned */}
      <Sidebar
        className="hidden lg:flex"
        onLogoutClick={openLogoutModal}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Drawer Panel */}
      <Sidebar
        className={`fixed top-3 bottom-3 left-3 z-50 transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onCloseMobile={closeSidebar}
        onLogoutClick={openLogoutModal}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 gap-2.5">
        {/* Topbar Header - Perfectly Top-Aligned with Sidebar */}
        <Topbar
          onToggleSidebar={toggleSidebar}
          onLogoutClick={openLogoutModal}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />

        {/* Dynamic Page Scroll Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] rounded-2xl custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
      />
    </div>
  );
}
