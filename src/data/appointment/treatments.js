// src/data/appointment/treatments.js

import treatmentsList from "../website/treatments";

// Export options mapped from the main treatments list to ensure synchronicity
export const treatmentOptions = treatmentsList.map((treatment) => ({
  value: treatment.slug,
  label: treatment.title
}));

export default treatmentOptions;
