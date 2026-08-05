// src/components/home/before-after/BeforeAfterInfo.jsx

import PropTypes from "prop-types";
import { Sparkles, FileText, CircleCheckBig } from "lucide-react";

const infoItems = (caseItem) => [
  {
    id: 1,
    title: "Treatment",
    icon: Sparkles,
    content: caseItem.treatment,
  },
  {
    id: 2,
    title: "About Treatment",
    icon: FileText,
    content: caseItem.aboutTreatment,
  },
  {
    id: 3,
    title: "Result",
    icon: CircleCheckBig,
    content: caseItem.result,
  },
];

const BeforeAfterInfo = ({ caseItem }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {infoItems(caseItem).map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.id}
            className="
              group
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-primary/20
              hover:shadow-xl
            "
          >
            {/* Icon */}
            <div
              className="
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
                transition-all
                duration-300
                group-hover:bg-primary
                group-hover:text-white
              "
            >
              <Icon size={26} strokeWidth={2} />
            </div>

            {/* Label */}
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
              {item.title}
            </p>

            {/* Content */}
            {item.id === 1 ? (
              <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900">
                {item.content}
              </h3>
            ) : (
              <p className="mt-3 leading-7 text-slate-600">
                {item.content}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
};

BeforeAfterInfo.propTypes = {
  caseItem: PropTypes.shape({
    treatment: PropTypes.string.isRequired,
    aboutTreatment: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
  }).isRequired,
};

export default BeforeAfterInfo;