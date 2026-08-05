// src/components/auth/PasswordInput.jsx

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {/* Input */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        autoComplete="current-password"
        className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-5 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm font-medium"
        {...props}
      />

      {/* Toggle Password */}
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary active:scale-95 cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <FiEyeOff className="text-lg" />
        ) : (
          <FiEye className="text-lg" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;