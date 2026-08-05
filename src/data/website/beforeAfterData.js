// src/data/beforeAfterData.js

import aestheticCompositeRestorationsBefore from "../../assets/images/before-after/aesthetic_composite_restorations_before.webp";
import aestheticCompositeRestorationsAfter from "../../assets/images/before-after/aesthetic_composite_restorations_after.webp";

import singleToothFillingBefore from "../../assets/images/before-after/single_tooth_filling_before.webp";
import singleToothFillingAfter from "../../assets/images/before-after/single_tooth_filling_after.webp";

import fullMouthImplantsBefore from "../../assets/images/before-after/full_mouth_implants_before.webp";
import fullMouthImplantsAfter from "../../assets/images/before-after/full_mouth_implants_after.webp";

const beforeAfterData = [
  {
    id: 1,
    treatment: "Aesthetic Composite Restorations",
    beforeImage: aestheticCompositeRestorationsBefore,
    afterImage: aestheticCompositeRestorationsAfter,
  },
  {
    id: 2,
    treatment: "Single Tooth Filling",
    beforeImage: singleToothFillingBefore,
    afterImage: singleToothFillingAfter,
  },
  {
    id: 3,
    treatment: "Full Mouth Dental Implants",
    beforeImage: fullMouthImplantsBefore,
    afterImage: fullMouthImplantsAfter,
  },
];

export default beforeAfterData;