import React from "react";

export default function WebsiteCard() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-[0_12px_24px_rgba(16,163,74,0.06)]"
      >
        {/* Abstract background blobs */}
        <circle cx="200" cy="150" r="110" fill="url(#greenGrad)" opacity="0.18" />
        <circle cx="120" cy="120" r="60" fill="url(#tealGrad)" opacity="0.12" />

        {/* Browser Card Backing */}
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

        {/* URL Bar */}
        <rect x="150" y="70" width="130" height="18" rx="9" fill="white" opacity="0.15" />
        <rect x="175" y="77" width="80" height="4" rx="2" fill="white" opacity="0.5" />

        {/* Website Content Mockup */}
        {/* Banner Hero area */}
        <rect
          x="94"
          y="110"
          width="212"
          height="40"
          rx="8"
          fill="#ECFDF5"
          stroke="#A7F3D0"
          strokeWidth="1"
        />
        <rect x="106" y="120" width="100" height="6" rx="3" fill="#10B981" />
        <rect x="106" y="132" width="60" height="4" rx="2" fill="#34D399" />
        <circle cx="276" cy="130" r="10" fill="#10B981" opacity="0.2" />

        {/* Gallery / Cards row */}
        <rect
          x="94"
          y="162"
          width="64"
          height="64"
          rx="8"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <rect x="102" y="202" width="48" height="5" rx="2.5" fill="#94A3B8" />
        <rect x="102" y="212" width="30" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="102" y="170" width="48" height="26" rx="4" fill="#E2E8F0" />

        <rect
          x="168"
          y="162"
          width="64"
          height="64"
          rx="8"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <rect x="176" y="202" width="48" height="5" rx="2.5" fill="#94A3B8" />
        <rect x="176" y="212" width="30" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="176" y="170" width="48" height="26" rx="4" fill="#E2E8F0" />

        <rect
          x="242"
          y="162"
          width="64"
          height="64"
          rx="8"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <rect x="250" y="202" width="48" height="5" rx="2.5" fill="#94A3B8" />
        <rect x="250" y="212" width="30" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="250" y="170" width="48" height="26" rx="4" fill="#E2E8F0" />

        {/* Floating Edit Pencil Badge */}
        <g transform="translate(300, 110)">
          <circle
            cx="15"
            cy="15"
            r="22"
            fill="white"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          <circle cx="15" cy="15" r="18" fill="#ECFDF5" />
          <path
            d="M11.5 18.5V15.5L17.5 9.5L20.5 12.5L14.5 18.5H11.5Z"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Gradients */}
        <defs>
          <radialGradient
            id="greenGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            transform="translate(200 150) rotate(90) scale(110)"
          >
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#34D399" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="tealGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            transform="translate(120 120) rotate(90) scale(60)"
          >
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
