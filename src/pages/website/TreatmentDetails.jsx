import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Breadcrumb from "../../components/website/treatments/Breadcrumb";
import TreatmentSection from "../../components/website/treatments/TreatmentSection";
import TreatmentCTA from "../../components/website/treatments/TreatmentCTA";
import Footer from "../../components/website/footer/Footer";
import staticTreatments from "../../data/website/treatments";
import { getTreatments } from "../../services/website/treatmentService";
import SEO from "../../components/seo/SEO";

const TreatmentDetails = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTreatmentData = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await getTreatments();
        const treatmentsList = response.data || [];

        // Search by Mongo ID, slug, or matching name
        const match = treatmentsList.find(
          (t) =>
            t._id === id ||
            t.id === id ||
            t.slug === id ||
            `treatment-${t._id}` === id ||
            (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id.toLowerCase())
        );

        if (match) {
          setTreatment(match);
        } else {
          // Check static fallback
          const staticMatch = staticTreatments.find(
            (s) => s.slug === id || s.id === id
          );
          if (staticMatch) {
            setTreatment(staticMatch);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch treatment details:", err);
        const staticMatch = staticTreatments.find(
          (s) => s.slug === id || s.id === id
        );
        if (staticMatch) {
          setTreatment(staticMatch);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentData();
  }, [id]);

  if (loading) {
    return (
      <main className="bg-white pt-[72px] lg:pt-[88px] min-h-[70vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Loading treatment details...</span>
      </main>
    );
  }

  if (notFound || !treatment) {
    return (
      <main className="bg-white pt-[72px] lg:pt-[88px]">
        <Breadcrumb />
        <div className="mx-auto max-w-xl py-20 px-5 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Not Found</h1>
          <p className="text-sm text-slate-600">
            The requested dental treatment could not be found or has been removed from our services.
          </p>
          <div className="pt-2">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E2A6D] text-white font-bold text-xs rounded-xl hover:bg-[#0a1e4e] transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Treatments</span>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white pt-[72px] lg:pt-[88px]">
      <SEO
        title={treatment ? `${treatment.name || treatment.title} Treatment` : "Dental Treatment Details"}
        description={treatment?.previewDescription || treatment?.description || "Learn about advanced dental treatment procedures at Kavuturu Dental Clinic in Tirupati."}
        canonical={`https://www.kavuturudentalclinic.com/treatments/${id}`}
      />
      <Breadcrumb />

      <TreatmentSection
        treatment={{
          id: treatment._id || treatment.id,
          slug: treatment.slug || (treatment._id ? `treatment-${treatment._id}` : ""),
          title: treatment.name || treatment.title,
          image: treatment.image || staticTreatments[0]?.image,
          description: treatment.fullDescription || treatment.previewDescription || treatment.description,
          highlights: Array.isArray(treatment.highlights) && treatment.highlights.length > 0
            ? treatment.highlights
            : ["Painless Procedure", "Advanced Technology"]
        }}
      />

      <TreatmentCTA />

      <Footer />
    </main>
  );
};

export default TreatmentDetails;