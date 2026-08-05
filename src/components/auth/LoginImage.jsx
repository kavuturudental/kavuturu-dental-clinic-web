// src/components/auth/LoginImage.jsx

import loginBg from "../../assets/images/login/login-image.png";
import { FiLock } from "react-icons/fi";

const LoginImage = () => {
  return (
    <aside className="relative hidden lg:block lg:w-1/2 h-full select-none overflow-hidden">
      {/* Background Image - Fill entire container without gaps */}
      <img
        src={loginBg}
        alt="Modern Dental Clinic"
        className="h-full w-full object-cover object-center"
        loading="eager"
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/20 to-slate-950/80" />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-12 text-white z-10">
        {/* Top Section */}
        <div className="pt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            WELCOME TO
          </span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white leading-tight uppercase">
            KAVUTURU DENTAL CLINIC
          </h1>
          <p className="mt-2 text-lg italic text-slate-200 font-light tracking-wide">
            "Your Smile, Our Responsibility"
          </p>
          <div className="mt-4 h-[1.5px] w-14 bg-blue-500/60" />
        </div>

        {/* Bottom Section: Security Badge / Card */}
        <div className="max-w-[480px] backdrop-blur-xl bg-slate-900/40 border border-white/10 p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-3 text-sm font-bold tracking-wider text-white uppercase">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <FiLock className="text-sm" />
            </span>
            <span>SECURE STAFF PORTAL</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Only authorized clinic staff including doctors and receptionists are permitted to access this system.
          </p>
          <p className="mt-2 text-xs font-semibold text-blue-400 tracking-wide">
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LoginImage;