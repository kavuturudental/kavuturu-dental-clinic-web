// src/utils/receptionist/helpers.js

export const formatLongDate = (dateString) => {
  if (!dateString) return "";
  let str = String(dateString).trim();
  if (str.includes("GMT") || str.includes("+0530") || str.includes("05.30") || str.includes("05:30")) {
    str = str.split("GMT")[0].split("+")[0].split("05:30")[0].split("05.30")[0].trim();
  }
  const datePart = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
  const [y, m, d] = datePart.split("-");
  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    }
  }
  return dateString;
};

export const formatShortDate = (dateString) => {
  if (!dateString) return "";
  let str = String(dateString).trim();
  if (str.includes("GMT") || str.includes("+0530") || str.includes("05.30") || str.includes("05:30")) {
    str = str.split("GMT")[0].split("+")[0].split("05:30")[0].split("05.30")[0].trim();
  }
  const datePart = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
  const [y, m, d] = datePart.split("-");
  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  }
  return dateString;
};

export const formatPhoneNumber = (phoneString) => {
  if (!phoneString) return "";
  return phoneString.replace(/(\+\d{2})(\d{5})(\d{5})/, "$1 $2-$3");
};
