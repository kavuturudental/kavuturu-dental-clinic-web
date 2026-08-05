// src/contexts/ReceptionistContext.jsx

import React, { createContext, useState, useEffect } from "react";
import receptionistService from "../services/receptionistService";

export const ReceptionistContext = createContext();

export const ReceptionistProvider = ({ children }) => {
  const [receptionist, setReceptionist] = useState(() => {
    try {
      return receptionistService?.getProfile ? receptionistService.getProfile() : { name: "Sindhu", role: "Receptionist" };
    } catch {
      return { name: "Sindhu", role: "Receptionist" };
    }
  });

  useEffect(() => {
    try {
      if (receptionistService?.getProfile) {
        const profile = receptionistService.getProfile();
        if (profile) setReceptionist(profile);
      }
    } catch (e) {
      console.error("Failed to load receptionist context profile:", e);
    }
  }, []);

  const updateReceptionist = (updatedData) => {
    try {
      if (receptionistService?.saveProfile) {
        const saved = receptionistService.saveProfile(updatedData);
        setReceptionist(saved);
      } else {
        setReceptionist(updatedData);
      }
    } catch (e) {
      console.error("Failed to update receptionist profile:", e);
      setReceptionist(updatedData);
    }
  };

  return (
    <ReceptionistContext.Provider
      value={{
        receptionist: receptionist || { name: "Sindhu", role: "Receptionist" },
        receptionistName: receptionist?.name || "Sindhu",
        receptionistRole: receptionist?.role || "Receptionist",
        updateReceptionist
      }}
    >
      {children}
    </ReceptionistContext.Provider>
  );
};
