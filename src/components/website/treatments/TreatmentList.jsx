import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import staticTreatments from "../../../data/website/treatments";
import TreatmentSection from "./TreatmentSection";
import { getTreatments } from "../../../services/website/treatmentService";

const TreatmentList = () => {
  const [treatmentList, setTreatmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatmentsData = async () => {
      try {
        const response = await getTreatments({ status: "Active" });
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setTreatmentList(response.data);
        } else {
          setTreatmentList(staticTreatments);
        }
      } catch (err) {
        console.error("Failed to load treatments list:", err);
        setTreatmentList(staticTreatments);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentsData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Loading Treatments...</span>
      </div>
    );
  }

  const displayList = treatmentList.length > 0 ? treatmentList : staticTreatments;

  return (
    <main className="bg-white">
      {displayList.map((treatment, index) => (
        <TreatmentSection
          key={treatment._id || treatment.id || index}
          treatment={{
            id: treatment._id || treatment.id,
            slug: treatment.slug || (treatment._id ? `treatment-${treatment._id}` : `section-${index}`),
            title: treatment.name || treatment.title,
            image: treatment.image || staticTreatments[0]?.image,
            description: treatment.fullDescription || treatment.previewDescription || treatment.description,
            highlights: Array.isArray(treatment.highlights) && treatment.highlights.length > 0
              ? treatment.highlights
              : ["Painless Procedure", "Advanced Technology"]
          }}
          reverse={index % 2 !== 0}
        />
      ))}
    </main>
  );
};

export default TreatmentList;