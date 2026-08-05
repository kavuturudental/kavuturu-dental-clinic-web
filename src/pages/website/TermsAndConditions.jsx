// src/pages/website/TermsAndConditions.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Home, ChevronRight, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";
import Footer from "../../components/website/footer/Footer";
import { getContact } from "../../services/website/contactService";
import { contactData as defaultContact } from "../../data/website/contactData";

const TermsAndConditions = () => {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchContactData = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data) {
          setContactInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to load contact info for Terms & Conditions:", err);
      }
    };

    fetchContactData();
  }, []);

  const phone = contactInfo?.primaryPhone || defaultContact.phone;
  const email = contactInfo?.email || defaultContact.email;
  const address = contactInfo?.address || defaultContact.address;

  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden font-sans min-h-screen flex flex-col justify-between">
      <PublicPageBackground />

      <div className="relative z-10 flex-grow">
        {/* Breadcrumb Section */}
        <section className="border-b border-slate-200/80 bg-transparent">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link to="/" className="flex items-center gap-2 text-slate-500 transition-colors hover:text-sky-600">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-900">Terms & Conditions</span>
            </nav>
          </div>
        </section>

        {/* Page Header */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-transparent">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm mb-4">
              <FileText className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Terms of Service
              </span>
            </div>
            <h1 className="font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
              Terms & Conditions
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-600">
              Read the terms governing the use of our website and services.
            </p>
          </div>
        </section>

        {/* Content Body Container */}
        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-[960px] px-5 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              
              {/* Introduction */}
              <div>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                  Welcome to the official website of <strong className="text-[#16A34A] font-extrabold">Kavuturu Dental Clinic</strong>. By accessing or using our website, submitting appointment requests, or viewing our content, you agree to be bound by the following Terms & Conditions. Please read them carefully before using our digital services.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-4 font-medium">
                  Effective Date: <strong className="text-slate-700">August 2026</strong>
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* 1. Acceptance of Terms */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  1. Acceptance of Terms
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  By browsing, navigating, or utilizing any feature of this website, you confirm that you have read, understood, and agreed to comply with these Terms & Conditions. If you do not agree with any part of these terms, you should refrain from using our website.
                </p>
              </div>

              {/* 2. Website Purpose */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  2. Website Purpose
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  This website is provided for informational and appointment scheduling purposes regarding dental treatments offered at Kavuturu Dental Clinic in Tirupati. Content published on this website—including articles, treatment descriptions, and FAQs—is intended for general awareness and should not replace formal in-person clinical diagnosis.
                </p>
              </div>

              {/* 3. Appointment Requests */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  3. Appointment Requests & Reservations
                </h2>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li><strong className="text-slate-900 font-bold">Slot Reservation:</strong> Submitting an online appointment request through our booking form does not guarantee an immediate confirmed consultation slot.</li>
                  <li><strong className="text-slate-900 font-bold">Clinic Confirmation:</strong> Appointments are finalized only after our receptionist desk reviews the request and confirms the schedule via phone call or SMS.</li>
                  <li><strong className="text-slate-900 font-bold">Cancellations & Rescheduling:</strong> Patients are kindly requested to inform the clinic at least 4 to 6 hours in advance if they need to cancel or reschedule their appointment.</li>
                </ul>
              </div>

              {/* 4. Patient Responsibilities */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  4. Patient Responsibilities
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">When using our website or attending clinical consultations, patients agree to:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li>Provide accurate, true, and complete contact details (full name, phone number, email) during booking.</li>
                  <li>Disclose relevant prior medical histories, allergies, or current medications to attending dentists prior to receiving treatment.</li>
                  <li>Follow pre-operative and post-operative dental care guidelines provided by our medical team.</li>
                </ul>
              </div>

              {/* 5. Medical Information Disclaimer */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  5. Medical & Clinical Disclaimer
                </h2>
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-amber-900 text-base sm:text-lg leading-relaxed">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Medical Disclaimer:</strong> Information provided on this website is for educational reference only. Individual dental outcomes vary depending on patient anatomy, bone density, oral hygiene, and compliance. Treatment plans are finalized only after thorough clinical examination and digital diagnostics by Dr. K. Ravindra Babu or authorized dental specialists.
                  </div>
                </div>
              </div>

              {/* 6. Intellectual Property */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  6. Intellectual Property Rights
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  All content published on this website—including logos, branding, text, photographs, treatment guides, before & after transformation cases, and design elements—is the exclusive property of Kavuturu Dental Clinic and protected by Indian copyright and intellectual property laws. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
                </p>
              </div>

              {/* 7. Website Availability */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  7. Website Availability & Modifications
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  We endeavor to maintain continuous website availability. However, Kavuturu Dental Clinic reserves the right to modify, suspend, or update any section, feature, or content on the website at any time without prior notice.
                </p>
              </div>

              {/* 8. Limitation of Liability */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  8. Limitation of Liability
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  To the fullest extent permitted by applicable law, Kavuturu Dental Clinic, its doctors, and staff shall not be liable for any direct, indirect, incidental, or consequential damages resulting from website downtime, technical glitches, or reliance on website content prior to professional consultation.
                </p>
              </div>

              {/* 9. External Links */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  9. External Links
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Our website may provide convenience links to third-party maps or external resources. We do not endorse or assume responsibility for the content, privacy practices, or accuracy of third-party websites.
                </p>
              </div>

              {/* 10. Changes to Terms */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  10. Changes to Terms
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Kavuturu Dental Clinic reserves the right to modify these Terms & Conditions at any time. Continued use of the website following published modifications constitutes acceptance of the updated terms.
                </p>
              </div>

              {/* 11. Governing Law */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  11. Governing Law & Jurisdiction
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  These Terms & Conditions are governed by and construed in accordance with the laws of India. Any legal disputes or claims arising in connection with this website shall be subject to the exclusive jurisdiction of the courts in Tirupati, Andhra Pradesh.
                </p>
              </div>

              {/* 12. Contact Information */}
              <div className="bg-[#FCFCFD] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="font-outfit text-xl sm:text-2xl font-bold text-[#0E2A6D]">
                  12. Contact Information
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  If you have any questions or clarifications regarding these Terms & Conditions, please contact us:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-base text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold mb-1">Kavuturu Dental Clinic</strong>
                      <span className="text-slate-600 leading-relaxed">{address}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#16A34A] shrink-0" />
                      <span className="text-slate-900 font-bold">{phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#2563EB] shrink-0" />
                      <span className="text-slate-700 font-medium">{email}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default TermsAndConditions;
