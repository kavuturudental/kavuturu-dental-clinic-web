// src/context/AppointmentRequestContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAppointmentRequests,
  approveAppointmentRequest,
  rejectAppointmentRequest,
  rescheduleAppointmentRequest
} from "../api/appointmentRequestApi";
import eventBus from "../utils/eventBus";

export const AppointmentRequestContext = createContext({
  requests: [],
  loading: true,
  error: "",
  fetchRequests: async () => {},
  approveRequest: async () => {},
  rejectRequest: async () => {},
  rescheduleRequest: async () => {}
});

export const AppointmentRequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setRequests([]);
      setLoading(false);
      return;
    }
    try {
      const response = await getAppointmentRequests();
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.requests)) {
        list = response.requests;
      }
      setRequests(list);
      setError("");
    } catch (err) {
      console.error("AppointmentRequestContext fetch error:", err);
      setRequests([]);
      setError(err.response?.data?.message || "Failed to load appointment requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = async (id) => {
    // 1. Immediate optimistic UI removal from Pending list
    setRequests((prev) => prev.filter((r) => r._id !== id && r.id !== id));

    try {
      const response = await approveAppointmentRequest(id);
      // Emit event to update Appointments, Notifications, and Dashboard Summary instantly
      eventBus.emit("STATE_UPDATED");
      eventBus.emit("APPOINTMENT_REQUEST_ACCEPTED", { id, response });
      await fetchRequests();
      return response;
    } catch (err) {
      console.error("approveRequest error:", err);
      await fetchRequests();
      throw err;
    }
  };

  const rejectRequest = async (id) => {
    // 1. Immediate optimistic UI removal from Pending list
    setRequests((prev) => prev.filter((r) => r._id !== id && r.id !== id));

    try {
      const response = await rejectAppointmentRequest(id);
      // Emit event to update Notifications and Dashboard Summary instantly
      eventBus.emit("STATE_UPDATED");
      eventBus.emit("APPOINTMENT_REQUEST_REJECTED", { id, response });
      await fetchRequests();
      return response;
    } catch (err) {
      console.error("rejectRequest error:", err);
      await fetchRequests();
      throw err;
    }
  };

  const rescheduleRequest = async (id, data) => {
    try {
      const response = await rescheduleAppointmentRequest(id, data);
      eventBus.emit("STATE_UPDATED");
      await fetchRequests();
      return response;
    } catch (err) {
      console.error("rescheduleRequest error:", err);
      await fetchRequests();
      throw err;
    }
  };

  useEffect(() => {
    fetchRequests();

    const unsubscribe = eventBus.on("STATE_UPDATED", fetchRequests);

    const interval = setInterval(() => {
      fetchRequests();
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [fetchRequests]);

  return (
    <AppointmentRequestContext.Provider
      value={{
        requests,
        loading,
        error,
        fetchRequests,
        approveRequest,
        rejectRequest,
        rescheduleRequest
      }}
    >
      {children}
    </AppointmentRequestContext.Provider>
  );
};

export const useAppointmentRequestsContext = () => useContext(AppointmentRequestContext);
