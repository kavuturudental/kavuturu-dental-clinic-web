// src/api/patientApi.js

import api from "../services/api";

/**
 * Get All Patients
 */
export const getPatients = async (params = {}) => {
  const response = await api.get("/patients", { params });
  return response.data;
};

/**
 * Get Single Patient
 */
export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

/**
 * Create Patient
 */
export const createPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

/**
 * Update Patient
 */
export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/patients/${id}`, patientData);
  return response.data;
};

/**
 * Delete Patient
 */
export const deletePatient = async (id) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};
