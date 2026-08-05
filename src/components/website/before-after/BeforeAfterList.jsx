// src/components/website/before-after/BeforeAfterList.jsx

import React, { useEffect, useState } from "react";
import BeforeAfterCard from "../home/before-after/BeforeAfterCard";
import staticBeforeAfterData from "../../../data/website/beforeAfterData";
import { getBeforeAfterCases } from "../../../services/website/beforeAfterService";

const BeforeAfterList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCases = async () => {
      try {
        const response = await getBeforeAfterCases();
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setCases(response.data);
        } else {
          setCases(staticBeforeAfterData);
        }
      } catch (err) {
        console.error("Failed to load all Before & After cases:", err);
        setCases(staticBeforeAfterData);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCases();
  }, []);

  const displayCases = cases.length > 0 ? cases : staticBeforeAfterData;

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayCases.map((caseItem) => (
            <BeforeAfterCard key={caseItem._id || caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterList;
