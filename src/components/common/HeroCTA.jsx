import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { contactData } from "../../data/website/contactData";
import { getContact } from "../../services/website/contactService";

const HeroCTA = ({
  primaryText = "Call Now",
  secondaryText = "Emergency Support",
  className = "mt-8",
}) => {
  const [phoneUrl, setPhoneUrl] = useState(contactData.callUrl);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data && res.data.primaryPhone) {
          const cleanPhone = res.data.primaryPhone.replace(/\s+/g, "");
          setPhoneUrl(`tel:${cleanPhone}`);
        }
      } catch (err) {
        console.error("Failed to load phone for HeroCTA:", err);
      }
    };
    fetchPhone();
  }, []);

  return (
    <div className={`flex flex-col items-start text-left ${className}`}>
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
        {/* Primary CTA - Call Now */}
        <a
          href={phoneUrl}
          className="
            group
            inline-flex
            items-center
            justify-center
            gap-2.5
            rounded-xl
            bg-secondary
            px-6
            sm:px-7
            py-3.5
            text-sm
            sm:text-base
            font-bold
            text-white
            whitespace-nowrap
            shadow-lg
            shadow-green-500/25
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-secondary-dark
            hover:shadow-xl
            hover:shadow-green-500/30
            cursor-pointer
            w-full
            sm:w-auto
          "
        >
          <Phone size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="whitespace-nowrap">{primaryText}</span>
        </a>

        {/* Secondary CTA */}
        <a
          href={phoneUrl}
          className="
            group
            inline-flex
            items-center
            justify-center
            gap-2.5
            rounded-xl
            bg-[#0E2A6D]
            px-6
            sm:px-7
            py-3.5
            text-sm
            sm:text-base
            font-bold
            text-white
            whitespace-nowrap
            shadow-lg
            shadow-blue-900/20
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#16398b]
            hover:shadow-xl
            cursor-pointer
            w-full
            sm:w-auto
          "
        >
          <Phone size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="whitespace-nowrap">{secondaryText}</span>
        </a>
      </div>
    </div>
  );
};

export default HeroCTA;
