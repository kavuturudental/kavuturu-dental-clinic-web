// src/services/cmsService.js

import websiteService from "./websiteService";

export const cmsService = {
  getHeroData: () => websiteService.getHeroData(),
  saveHeroData: (data) => websiteService.saveHeroData(data),
  getAboutData: () => websiteService.getAboutData(),
  saveAboutData: (data) => websiteService.saveAboutData(data),
  getTreatments: () => websiteService.getTreatments(),
  saveTreatments: (data) => websiteService.saveTreatments(data),
  getDoctors: () => websiteService.getDoctors(),
  saveDoctors: (data) => websiteService.saveDoctors(data),
  getBeforeAfterCases: () => websiteService.getBeforeAfterCases(),
  saveBeforeAfterCases: (data) => websiteService.saveBeforeAfterCases(data),
  getGallery: () => websiteService.getGallery(),
  saveGallery: (data) => websiteService.saveGallery(data),
  getTestimonials: () => websiteService.getTestimonials(),
  saveTestimonials: (data) => websiteService.saveTestimonials(data),
  getBlogs: () => websiteService.getBlogs(),
  saveBlogs: (data) => websiteService.saveBlogs(data),
  getClinicInfo: () => websiteService.getClinicInfo(),
  saveClinicInfo: (data) => websiteService.saveClinicInfo(data)
};

export default cmsService;
