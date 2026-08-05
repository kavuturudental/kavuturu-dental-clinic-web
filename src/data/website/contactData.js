// src/data/contactData.js

export const contactData = {
  clinicName: "Kavuturu Dental Clinic & Dental Hospital",
  phone: "+91 8309479901",
  callUrl: "tel:+918309479901",
  secondaryPhone: "+91 8790302211",
  secondaryCallUrl: "tel:+918790302211",
  email: "kavuturudentalclinic@gmail.com",
  mailUrl: "mailto:kavuturudentalclinic@gmail.com",
  whatsappUrl: "https://wa.me/918309479901",
  directionsUrl: "https://maps.app.goo.gl/hG5cK9dZT8xY5k9j8",
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.390141554917!2d79.43240977485387!3d13.643617386737045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b0039c88745%3A0xee1b52b136977a26!2sKAVUTURU%20DENTAL%20CLINIC%20%26%20DENTAL%20HOSPITAL%20%E2%80%93%20Dental%20Implants%20%26%20Aligners%20in%20Tirupati!5e1!3m2!1sen!2sin!4v1784371540143!5m2!1sen!2sin",
  
  // List of phone numbers without labels
  phones: [
    {
      number: "+91 8309479901",
      link: "tel:+918309479901",
    },
    {
      number: "+91 8790302211",
      link: "tel:+918790302211",
    },
  ],

  // Nested structure for the Homepage Contact section
  info: {
    address: {
      title: "Clinic Address",
      value: "Lakshmi Towers, 22-7-54/1A, Karakambadi Rd, near Leela Mahal Circle, Subbareddy Nagar, Akkarampalle, Tirupati, Andhra Pradesh 517501",
      link: "https://maps.app.goo.gl/hG5cK9dZT8xY5k9j8"
    },
    phones: {
      title: "Phone Numbers",
      list: [
        {
          number: "+91 8309479901",
          link: "tel:+918309479901"
        },
        {
          number: "+91 8790302211",
          link: "tel:+918790302211"
        }
      ]
    },
    email: {
      title: "Email Address",
      value: "kavuturudentalclinic@gmail.com",
      link: "mailto:kavuturudentalclinic@gmail.com"
    },
    timings: {
      title: "Clinic Timings",
      days: "Monday - Saturday",
      hours: "09:30 AM - 09:00 PM",
      sundayHours: "10:00 AM - 01:00 PM"
    }
  },

  actions: {
    call: {
      label: "Call Now",
      link: "tel:+918309479901"
    },
    whatsapp: {
      label: "WhatsApp Chat",
      link: "https://wa.me/918309479901"
    },
    directions: {
      label: "Get Directions",
      link: "https://maps.app.goo.gl/hG5cK9dZT8xY5k9j8"
    }
  }
};

// Flat exports for backward compatibility
export const contactInfo = {
  address: contactData.info.address,
  phone: {
    title: "Call Us Today",
    value: contactData.phone,
    link: contactData.callUrl
  },
  email: {
    title: "Email Queries",
    value: contactData.email,
    link: contactData.mailUrl
  }
};

export const operationalHours = [
  { day: "Monday", hours: "09:30 AM - 09:00 PM" },
  { day: "Tuesday", hours: "09:30 AM - 09:00 PM" },
  { day: "Wednesday", hours: "09:30 AM - 09:00 PM" },
  { day: "Thursday", hours: "09:30 AM - 09:00 PM" },
  { day: "Friday", hours: "09:30 AM - 09:00 PM" },
  { day: "Saturday", hours: "09:30 AM - 09:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 01:00 PM" }
];

export const googleMapEmbedUrl = contactData.googleMapEmbedUrl;

export default contactData;
