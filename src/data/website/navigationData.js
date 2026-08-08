// src/data/navigationData.js

const navigationData = [
  {
    id: 1,
    label: "Home",
    href: "/",
    type: "route",
  },
  {
    id: 2,
    label: "About",
    href: "/about",
    type: "route",
  },
  {
    id: 3,
    label: "Treatments",
    href: "/treatments",
    type: "dropdown",
    hasDropdown: true,
  },
  {
    id: 4,
    label: "Doctors",
    href: "/doctors",
    type: "route",
  },
  {
    id: 5,
    label: "Testimonials",
    href: "#before-after",
    type: "section",
  },
  {
    id: 6,
    label: "Blogs",
    href: "/blogs",
    type: "route",
  },
  {
    id: 7,
    label: "Contact",
    href: "/contact",
    type: "route",
  },
];

export default navigationData;