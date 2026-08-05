// src/services/appointmentService.js

import appointmentManagementService from "./appointmentManagementService";

export const appointmentService = {
  getAppointments: (params) => appointmentManagementService.getAppointments(params),
  getAppointmentsByDateRange: (start, end) => appointmentManagementService.getAppointmentsByDateRange(start, end),
  getAppointmentById: (id) => appointmentManagementService.getAppointmentById(id),
  saveAppointments: (data) => appointmentManagementService.saveAppointments(data),
  addAppointment: (data) => appointmentManagementService.addAppointment(data),
  updateAppointment: (id, updates) => appointmentManagementService.updateAppointment(id, updates),
  updateStatus: (id, status) => appointmentManagementService.updateStatus(id, status),
  deleteAppointment: (id) => appointmentManagementService.deleteAppointment(id),
  getRequests: () => appointmentManagementService.getRequests(),
  saveRequests: (data) => appointmentManagementService.saveRequests(data),
  acceptRequest: (id) => appointmentManagementService.acceptRequest(id),
  rejectRequest: (id) => appointmentManagementService.rejectRequest(id),
  rescheduleRequest: (id, newDate, newTime) => appointmentManagementService.rescheduleRequest(id, newDate, newTime)
};

export default appointmentService;
