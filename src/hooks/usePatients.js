// src/hooks/usePatients.js

import { useState, useEffect } from "react";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient
} from "../api/patientApi";
import appointmentManagementService from "../services/appointmentManagementService";

import eventBus from "../utils/eventBus";

export default function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPatients();
      const list = res.data || res || [];
      setPatients(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Backend patient API call failed:", err);
      try {
        const localPatients = appointmentManagementService.getPatients();
        setPatients(Array.isArray(localPatients) ? localPatients : []);
      } catch {
        setError(err.response?.data?.message || "Failed to load patients");
      }
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (data) => {
    try {
      const res = await createPatient(data);
      await fetchPatients();
      return res;
    } catch (err) {
      const res = appointmentManagementService.addPatient(data);
      await fetchPatients();
      return res;
    }
  };

  const editPatient = async (id, data) => {
    try {
      const res = await updatePatient(id, data);
      await fetchPatients();
      return res;
    } catch (err) {
      const res = appointmentManagementService.updatePatient(id, data);
      await fetchPatients();
      return res;
    }
  };

  const removePatient = async (id) => {
    try {
      const res = await deletePatient(id);
      await fetchPatients();
      return res;
    } catch (err) {
      const res = appointmentManagementService.deletePatient(id);
      await fetchPatients();
      return res;
    }
  };

  useEffect(() => {
    fetchPatients();
    const unsubscribe = eventBus.on("STATE_UPDATED", fetchPatients);
    const interval = setInterval(fetchPatients, 5000);

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    editPatient,
    removePatient
  };
}
