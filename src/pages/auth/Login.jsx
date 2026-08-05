// src/pages/auth/Login.jsx

import React from "react";
import LoginImage from "../../components/auth/LoginImage";
import LoginCard from "../../components/auth/LoginCard";

const Login = () => {
  return (
    <main className="h-screen w-screen bg-[#F7F9FC] flex flex-col justify-center overflow-hidden">
      <div className="w-[95%] max-w-[1800px] h-[calc(100vh-32px)] my-4 mx-auto rounded-[32px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex">
        {/* Left Side */}
        <LoginImage />

        {/* Right Side */}
        <section className="w-full lg:w-1/2 h-full bg-[#F7F9FC] flex items-center justify-center p-6 md:p-12 lg:overflow-hidden overflow-y-auto">
          <LoginCard />
        </section>
      </div>
    </main>
  );
};

export default Login;