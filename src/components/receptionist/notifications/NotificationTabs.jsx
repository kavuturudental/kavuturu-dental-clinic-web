import React from "react";
import clsx from "clsx";

const tabs = ["All", "Unread", "Read"];

const NotificationTabs = ({ activeTab, onChangeTab, unreadCount }) => {
  return (
    <div className="flex items-center gap-2 select-none border-b border-slate-100 pb-4">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 outline-none cursor-pointer border active:scale-95 flex items-center gap-1.5",
              {
                "bg-[#0E2A6D] text-white border-[#0E2A6D] shadow-sm": isSelected,
                "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700": !isSelected
              }
            )}
          >
            <span>{tab}</span>
            {tab === "Unread" && unreadCount > 0 && (
              <span
                className={clsx(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs",
                  isSelected ? "bg-white text-[#0E2A6D]" : "bg-[#EF4444] text-white"
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationTabs;
