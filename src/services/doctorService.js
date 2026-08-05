import { defaultClinicDetails } from "../data/doctor/clinicDetailsData";

const STORAGE_KEY = "kdc_clinic_details";
const PROFILE_KEY = "kdc_doctor_profile";

const defaultDoctorProfile = {
  name: "Dr. K. Ravindra Babu",
  qualification: "B.D.S., M.D.S. (Oral & Maxillofacial Surgeon)",
  specialization: "Dental Implantologist & Cosmetic Dentist",
  bio: "Over 15+ years of clinical excellence providing painless laser root canal treatments and advanced full mouth implants.",
  experienceYears: 15,
  happyPatients: "10,000+",
  successfulTreatments: "15,000+",
  rating: 4.9,
  photoUrl: "/assets/images/doctors/dr-ravindra-babu.webp"
};

export const doctorService = {
  getClinicDetails: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClinicDetails));
        return defaultClinicDetails;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load clinic details:", error);
      return defaultClinicDetails;
    }
  },

  saveClinicDetails: (details) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      return { success: true, message: "Clinic details saved successfully!" };
    } catch (error) {
      console.error("Failed to save clinic details:", error);
      return { success: false, message: "Failed to save changes." };
    }
  },

  getProfile: () => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultDoctorProfile));
        return defaultDoctorProfile;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load doctor profile:", error);
      return defaultDoctorProfile;
    }
  },

  saveProfile: (profile) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return { success: true, message: "Doctor profile saved successfully!" };
    } catch (error) {
      console.error("Failed to save doctor profile:", error);
      return { success: false, message: "Failed to save changes." };
    }
  }
};

export default doctorService;
