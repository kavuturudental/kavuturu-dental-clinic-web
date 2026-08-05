// src/services/appointmentManagementService.js

import doctorAppointmentApi from "./doctorAppointmentApi";

const APPOINTMENTS_STORAGE_KEY = "kdc_doctor_appointments";
const PATIENTS_STORAGE_KEY = "kdc_doctor_patients";

const todayStr = new Date().toISOString().split("T")[0];

const initialPatients = [];
const initialAppointments = [];

const initStorage = () => {
  if (!localStorage.getItem(APPOINTMENTS_STORAGE_KEY)) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(PATIENTS_STORAGE_KEY)) {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify([]));
  }
};

const notifyUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kdc-appointment-updated"));
  }
};

export const appointmentManagementService = {
  getAppointments: async (params = {}) => {
    try {
      const response = await doctorAppointmentApi.getAppointments(params);
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      return [];
    }
  },

  getAppointmentById: async (id) => {
    const list = await appointmentManagementService.getAppointments();
    return list.find((item) => item.id === id || item._id === id) || null;
  },

  createAppointment: async (data) => {
    const list = await appointmentManagementService.getAppointments();
    const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment = {
      id: newId,
      patientName: data.patientName,
      phoneNumber: data.phoneNumber,
      email: data.email || `${data.patientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      age: data.age ? parseInt(data.age) : 30,
      gender: data.gender || "Other",
      treatment: data.treatment || "General Consultation",
      doctor: data.doctor || "Dr. K. Ravindra Babu",
      date: data.date || todayStr,
      time: data.time || "10:00 AM",
      status: data.status || "Confirmed",
      source: data.source || "Walk-in",
      notes: data.notes || "",
      createdOn: todayStr
    };

    const updatedList = [newAppointment, ...list];
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedList));

    notifyUpdate();
    return { success: true, appointment: newAppointment };
  },

  updateAppointmentStatus: async (id, newStatus) => {
    const list = await appointmentManagementService.getAppointments();
    let targetApt = null;

    const updatedList = list.map((apt) => {
      if (apt.id === id || apt._id === id) {
        targetApt = { ...apt, status: newStatus };
        return targetApt;
      }
      return apt;
    });

    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    notifyUpdate();
    return { success: true, appointment: targetApt };
  },

  updateAppointment: async (id, updateData) => {
    const list = await appointmentManagementService.getAppointments();
    let updatedItem = null;

    const updatedList = list.map((apt) => {
      if (apt.id === id || apt._id === id) {
        updatedItem = { ...apt, ...updateData };
        return updatedItem;
      }
      return apt;
    });

    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    notifyUpdate();
    return { success: true, appointment: updatedItem };
  },

  deleteAppointment: async (id) => {
    const list = await appointmentManagementService.getAppointments();
    const updatedList = list.filter((apt) => apt.id !== id && apt._id !== id);
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    notifyUpdate();
    return { success: true };
  },

  getPatients: () => {
    try {
      const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading patients:", e);
      return [];
    }
  },

  getPatientById: (id) => {
    const patients = appointmentManagementService.getPatients();
    return patients.find((p) => p.id === id || p._id === id) || null;
  },

  getPatientStats: (period = "today", customStart = "", customEnd = "") => {
    const patients = appointmentManagementService.getPatients();
    const monthPrefix = todayStr.substring(0, 7);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekStartStr = sevenDaysAgo.toISOString().split("T")[0];

    const isInPeriod = (dateStr) => {
      if (!dateStr) return false;
      if (period === "today") return dateStr === todayStr;
      if (period === "week") return dateStr >= weekStartStr && dateStr <= todayStr;
      if (period === "month") return dateStr.startsWith(monthPrefix);
      if (period === "custom") {
        if (customStart && customEnd) return dateStr >= customStart && dateStr <= customEnd;
        if (customStart) return dateStr >= customStart;
        if (customEnd) return dateStr <= customEnd;
        return true;
      }
      return true;
    };

    const periodPatients = patients.filter((p) => isInPeriod(p.lastVisit) || isInPeriod(p.registrationDate) || isInPeriod(p.nextAppointment));
    const activeList = periodPatients.length > 0 ? periodPatients : patients;

    const totalPatients = activeList.length;
    const newPatientsToday = activeList.filter((p) => isInPeriod(p.registrationDate)).length;
    const newPatientsThisMonth = activeList.filter((p) => p.registrationDate && p.registrationDate.startsWith(monthPrefix)).length;
    const returningPatients = activeList.filter((p) => (p.totalVisits || 1) > 1).length;
    const activePatients = activeList.filter((p) => p.status === "Active").length;
    const followUpPatients = activeList.filter((p) => p.source === "Follow-up" || (p.totalVisits || 1) > 1).length;

    return {
      totalPatients: totalPatients || 0,
      newPatientsToday: newPatientsToday || 0,
      newPatientsThisMonth: newPatientsThisMonth || 0,
      returningPatients: returningPatients || 0,
      activePatients: activePatients || 0,
      followUpPatients: followUpPatients || 0
    };
  },

  getDashboardStats: () => {
    const appointments = appointmentManagementService.getPatients();
    const todayApts = appointments.filter((a) => a.date === todayStr);

    const todayCount = todayApts.length;
    const pendingCount = appointments.filter((a) => a.status === "Pending").length;
    const waitingCount = appointments.filter((a) => a.status === "Waiting" || a.status === "Checked In").length;
    const inProgressCount = appointments.filter((a) => a.status === "In Chair" || a.status === "In Progress").length;
    const completedToday = todayApts.filter((a) => a.status === "Completed").length;
    const cancelledCount = appointments.filter((a) => a.status === "Cancelled" || a.status === "No Show").length;

    return {
      todayCount: todayCount || 0,
      pendingCount: pendingCount || 0,
      waitingCount: waitingCount || 0,
      inProgressCount: inProgressCount || 0,
      completedToday: completedToday || 0,
      cancelledCount: cancelledCount || 0,
      todayAppointments: todayApts
    };
  }
};

export default appointmentManagementService;
