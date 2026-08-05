// src/context/AppointmentContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from "../api/appointmentApi";
import appointmentManagementService from "../services/appointmentManagementService";
import eventBus from "../utils/eventBus";

export const AppointmentsContext = createContext({
  appointments: [],
  loading: true,
  error: "",
  fetchAppointments: async () => {},
  addAppointment: async () => {},
  editAppointment: async () => {},
  changeAppointmentStatus: async () => {},
  removeAppointment: async () => {}
});

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    try {
      const response = await getAppointments();
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.appointments)) {
        list = response.appointments;
      }
      setAppointments(list);
      setError("");
    } catch (err) {
      console.warn("Backend API call failed, loading local appointments fallback:", err);
      try {
        const localData = await appointmentManagementService.getAppointments();
        setAppointments(Array.isArray(localData) ? localData : []);
        setError("");
      } catch (localErr) {
        setAppointments([]);
        setError(err.response?.data?.message || "Failed to load appointments.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = async (data) => {
    try {
      const res = await createAppointment(data);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    } catch (err) {
      const res = await appointmentManagementService.createAppointment(data);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    }
  };

  const editAppointment = async (id, data) => {
    try {
      const res = await updateAppointment(id, data);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    } catch (err) {
      const res = await appointmentManagementService.updateAppointment(id, data);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    }
  };

  const changeAppointmentStatus = async (id, status) => {
    try {
      const res = await updateAppointmentStatus(id, status);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    } catch (err) {
      const res = await appointmentManagementService.updateAppointmentStatus(id, status);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    }
  };

  const removeAppointment = async (id) => {
    try {
      const res = await deleteAppointment(id);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    } catch (err) {
      const res = await appointmentManagementService.deleteAppointment(id);
      eventBus.emit("STATE_UPDATED");
      await fetchAppointments();
      return res;
    }
  };

  useEffect(() => {
    fetchAppointments();

    const handleStateUpdated = () => {
      fetchAppointments();
    };

    const unsubscribe = eventBus.on("STATE_UPDATED", handleStateUpdated);

    const interval = setInterval(() => {
      fetchAppointments();
    }, 4000);

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      else eventBus.off("STATE_UPDATED", handleStateUpdated);
      clearInterval(interval);
    };
  }, [fetchAppointments]);

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        error,
        fetchAppointments,
        addAppointment,
        editAppointment,
        changeAppointmentStatus,
        removeAppointment
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};
