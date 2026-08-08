// src/pages/website/PrivacyPolicy.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Home, ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";
import Footer from "../../components/website/footer/Footer";
import { getContact } from "../../services/website/contactService";
import { contactData as defaultContact } from "../../data/website/contactData";
import SEO from "../../components/seo/SEO";

const PrivacyPolicy = () => {
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
        console.error("Failed to load contact info for Privacy Policy:", err);
      }
    };

    fetchContactData();
  }, []);

  const phone = contactInfo?.primaryPhone || defaultContact.phone;
  const email = contactInfo?.email || defaultContact.email;
  const address = contactInfo?.address || defaultContact.address;

  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden font-sans min-h-screen flex flex-col justify-between">
      <SEO
        title="Privacy Policy | Kavuturu Dental Clinic Tirupati"
        description="Official privacy policy and patient data confidentiality guidelines for Kavuturu Dental Clinic."
        canonical="https://www.kavuturudentalclinic.com/privacy-policy"
      />
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
              <span className="font-medium text-slate-900">Privacy Policy</span>
            </nav>
          </div>
        </section>

        {/* Page Header */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-transparent">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm mb-4">
              <Shield className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Legal & Governance
              </span>
            </div>
            <h1 className="font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-600">
              Learn how Kavuturu Dental Clinic collects, uses, and protects your personal information.
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
                  At <strong className="text-[#16A34A] font-extrabold">Kavuturu Dental Clinic</strong>, we are committed to respecting your privacy and protecting the confidentiality of your personal and medical information. This Privacy Policy outlines the types of information we collect when you visit our website or request dental appointments, how we use that information, and your rights regarding your data.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-4 font-medium">
                  Last Updated: <strong className="text-slate-700">August 2026</strong>
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* 1. Information We Collect */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  1. Information We Collect
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  We may collect personal information from you in several ways when you interact with our website or services:
                </p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li><strong className="text-slate-900 font-bold">Personal Identifiers:</strong> Your full name, phone number, email address, and preferred appointment dates when submitted through our online booking or contact forms.</li>
                  <li><strong className="text-slate-900 font-bold">Appointment Details:</strong> Selected treatment categories, specific dental concerns, or notes provided during slot reservations.</li>
                  <li><strong className="text-slate-900 font-bold">Technical & Usage Data:</strong> Anonymized browsing data including IP address, browser type, device information, and pages visited to help optimize website performance.</li>
                </ul>
              </div>

              {/* 2. How We Use Your Information */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  2. How We Use Your Information
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Kavuturu Dental Clinic uses your information strictly for legitimate medical and operational purposes:
                </p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li>Processing, confirming, and scheduling your dental appointments and consultations.</li>
                  <li>Sending appointment reminders, updates, or follow-up communications via SMS, phone, or email.</li>
                  <li>Responding to inquiries or medical queries submitted through our contact forms.</li>
                  <li>Improving our website usability, patient experience, and clinic service quality.</li>
                </ul>
              </div>

              {/* 3. Information Sharing */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  3. Information Sharing & Disclosure
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  We strictly protect your personal records. <strong className="text-slate-900 font-bold">We do not sell, rent, or trade your personal data to third parties for marketing purposes.</strong> We may only share information under the following limited circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li><strong className="text-slate-900 font-bold">Healthcare Professionals:</strong> Shared internally with our attending doctors, dental specialists, and authorized staff for treatment coordination.</li>
                  <li><strong className="text-slate-900 font-bold">Legal Compliance:</strong> When required by law, court orders, or health authority regulations in India.</li>
                  <li><strong className="text-slate-900 font-bold">Service Providers:</strong> Secure third-party hosting, SMS gateway, or analytics providers bound by strict confidentiality agreements.</li>
                </ul>
              </div>

              {/* 4. Data Security */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  4. Data Security
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  We employ industry-standard technical, administrative, and physical safeguards to prevent unauthorized access, disclosure, alteration, or destruction of your personal information. Database connections are encrypted, and access is limited strictly to authorized medical personnel.
                </p>
              </div>

              {/* 5. Cookies */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  5. Cookies & Tracking Technologies
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Our website uses essential session cookies to enhance navigation and remember form states. You can control or disable cookies through your browser settings, though doing so may limit certain interactive features of our website.
                </p>
              </div>

              {/* 6. Appointment Information */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  6. Appointment & Medical Records
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Submitting an appointment request through our website does not create a binding doctor-patient relationship until confirmed by our clinic desk. Official medical histories and clinical records recorded during in-person visits are maintained separately under clinical confidentiality standards.
                </p>
              </div>

              {/* 7. Third-Party Services */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  7. Third-Party Services & Links
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Our website may contain links to external sites (such as Google Maps or official social media pages). Kavuturu Dental Clinic is not responsible for the privacy practices or content of third-party websites.
                </p>
              </div>

              {/* 8. Your Rights */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  8. Your Rights & Choices
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-[#2563EB] text-base sm:text-lg text-slate-600 leading-relaxed">
                  <li>Request access to or a copy of the personal contact details we hold about you.</li>
                  <li>Request corrections to any inaccurate or incomplete contact records.</li>
                  <li>Request deletion of your online appointment history, subject to statutory medical record retention laws.</li>
                </ul>
              </div>

              {/* 9. Policy Updates */}
              <div className="space-y-4">
                <h2 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A6D]">
                  9. Policy Updates
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  We may periodically update this Privacy Policy to reflect changes in legal requirements or clinic operations. Revised policies will be published on this page with an updated effective date.
                </p>
              </div>

              {/* 10. Contact Information */}
              <div className="bg-[#FCFCFD] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="font-outfit text-xl sm:text-2xl font-bold text-[#0E2A6D]">
                  10. Contact Information
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how your information is handled, please contact us:
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

export default PrivacyPolicy;
