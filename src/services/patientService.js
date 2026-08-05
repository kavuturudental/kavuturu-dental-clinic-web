// src/services/patientService.js

import appointmentManagementService from "./appointmentManagementService";

export const patientService = {
  getPatients: () => appointmentManagementService.getPatients(),
  getPatientById: (id) => appointmentManagementService.getPatientById(id),
  savePatients: (data) => appointmentManagementService.savePatients(data),
  addPatient: (patientData) => appointmentManagementService.addPatient(patientData),
  updatePatient: (id, updates) => appointmentManagementService.updatePatient(id, updates),
  deletePatient: (id) => appointmentManagementService.deletePatient(id),
  addTreatmentHistory: (patientId, record) => appointmentManagementService.addTreatmentHistory(patientId, record)
};

export default patientService;
