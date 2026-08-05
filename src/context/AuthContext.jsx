// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return authService.getUser();
  });

  useEffect(() => {
    // Synchronize authenticated user profile with backend single source of truth on mount
    const fetchFreshProfile = async () => {
      if (authService.getToken()) {
        try {
          const res = await authService.getProfile();
          if (res?.data) {
            updateUser(res.data);
          }
        } catch (e) {
          console.log("Profile sync notice:", e.message);
          if (e.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      }
    };

    fetchFreshProfile();

    // Listen for custom "userUpdated" events and storage changes
    const handleUserUpdate = (e) => {
      const updatedUser = e?.detail || authService.getUser();
      setUser(updatedUser);
    };

    const handleStorage = (e) => {
      if (e.key === "user") {
        setUser(authService.getUser());
      }
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateUser = (updatedUserData) => {
    if (!updatedUserData) return;
    const currentUser = authService.getUser() || {};
    const newUser = {
      ...currentUser,
      ...updatedUserData,
      id: updatedUserData._id || updatedUserData.id || currentUser.id,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    window.dispatchEvent(new CustomEvent("userUpdated", { detail: newUser }));
    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        isAuthenticated: Boolean(user && user.role),
        isDoctor: user?.role?.toLowerCase() === "doctor",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback if component is rendered outside AuthProvider
    const fallbackUser = authService.getUser();
    return {
      user: fallbackUser,
      setUser: () => {},
      updateUser: (updatedData) => {
        const newUser = { ...fallbackUser, ...updatedData };
        localStorage.setItem("user", JSON.stringify(newUser));
        window.dispatchEvent(new CustomEvent("userUpdated", { detail: newUser }));
        return newUser;
      },
      isAuthenticated: Boolean(fallbackUser && fallbackUser.role),
      isDoctor: fallbackUser?.role?.toLowerCase() === "doctor",
    };
  }
  return context;
};

export default AuthContext;
