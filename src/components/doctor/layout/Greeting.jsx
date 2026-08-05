import React from "react";
import { motion } from "framer-motion";

export default function Greeting() {
  const getGreetingText = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const text = getGreetingText();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="select-none space-y-1.5"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A6D] tracking-tight leading-tight">
        {text}, Dr. K. Ravindra Babu 👋
      </h2>
      <p className="text-sm sm:text-base font-semibold text-slate-500">
        Welcome back. Choose a module to continue.
      </p>
    </motion.div>
  );
}
