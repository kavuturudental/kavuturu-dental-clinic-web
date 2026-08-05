// src/api/patientApi.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Get All Patients
 */
export const getPatients = async (params = {}) => {
  const response = await API.get("/patients", { params });
  return response.data;
};

/**
 * Get Single Patient
 */
export const getPatientById = async (id) => {
  const response = await API.get(`/patients/${id}`);
  return response.data;
};

/**
 * Create Patient
 */
export const createPatient = async (patientData) => {
  const response = await API.post("/patients", patientData);
  return response.data;
};

/**
 * Update Patient
 */
export const updatePatient = async (id, patientData) => {
  const response = await API.put(`/patients/${id}`, patientData);
  return response.data;
};

/**
 * Delete Patient
 */
export const deletePatient = async (id) => {
  const response = await API.delete(`/patients/${id}`);
  return response.data;
};
