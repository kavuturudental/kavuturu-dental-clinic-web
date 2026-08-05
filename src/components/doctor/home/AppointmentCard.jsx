import React from "react";

export default function AppointmentCard() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-[0_12px_24px_rgba(14,42,109,0.06)]"
      >
        {/* Abstract background blobs */}
        <circle cx="200" cy="150" r="110" fill="url(#blueGrad)" opacity="0.18" />
        <circle cx="280" cy="110" r="55" fill="url(#purpleGrad)" opacity="0.12" />

        {/* Dashboard Grid Card Backing */}
        <rect
          x="80"
          y="60"
          width="240"
          height="180"
          rx="24"
          fill="white"
          stroke="#E2E8F0"
          strokeWidth="2"
        />

        {/* Header Bar */}
        <rect x="80" y="60" width="240" height="38" rx="20" fill="#0E2A6D" />
        <circle cx="104" cy="79" r="4.5" fill="#FF5F56" />
        <circle cx="118" cy="79" r="4.5" fill="#FFBD2E" />
        <circle cx="132" cy="79" r="4.5" fill="#27C93F" />

        {/* Date block */}
        <rect x="100" y="115" width="45" height="45" rx="12" fill="#EBF3FF" />
        <rect x="100" y="115" width="45" height="12" rx="3" fill="#3B82F6" />
        <rect
          x="110"
          y="135"
          width="25"
          height="16"
          rx="4"
          fill="#3B82F6"
          opacity="0.35"
        />

        {/* Patient Schedule card 1 */}
        <rect
          x="160"
          y="115"
          width="140"
          height="45"
          rx="12"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        <circle cx="178" cy="137.5" r="11" fill="#E2E8F0" />
        <rect x="196" y="128" width="55" height="6" rx="3" fill="#64748B" />
        <rect x="196" y="140" width="35" height="4" rx="2" fill="#94A3B8" />
        <circle cx="282" cy="137.5" r="4.5" fill="#10B981" />

        {/* Patient Schedule card 2 */}
        <rect
          x="100"
          y="175"
          width="200"
          height="48"
          rx="12"
          fill="#F8FAFC"
          stroke="#EBF3FF"
          strokeWidth="1.5"
        />
        <circle cx="120" cy="199" r="11" fill="#3B82F6" opacity="0.1" />
        <path
          d="M117 199H123M120 196V202"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="138" y="190" width="85" height="6" rx="3" fill="#3B82F6" />
        <rect x="138" y="202" width="55" height="4" rx="2" fill="#94A3B8" />

        {/* Floating Clock Badge */}
        <g transform="translate(300, 75)">
          <circle
            cx="15"
            cy="15"
            r="22"
            fill="white"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          <circle cx="15" cy="15" r="18" fill="#EBF3FF" />
          <path
            d="M15 8.5V15H19.5"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Gradients */}
        <defs>
          <radialGradient
            id="blueGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            transform="translate(200 150) rotate(90) scale(110)"
          >
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="purpleGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            transform="translate(280 110) rotate(90) scale(55)"
          >
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
