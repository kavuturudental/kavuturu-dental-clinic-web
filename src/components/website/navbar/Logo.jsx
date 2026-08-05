import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logos/logo.png";

function Logo() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      // ScrollToTop component will handle scrolling to top
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      aria-label="Kavuturu Dental Clinic"
      className="flex items-center"
    >
      <img
        src={logo}
        alt="Kavuturu Dental Clinic"
        className="
          h-14
          w-auto
          object-contain
          transition-transform
          duration-300
          hover:scale-105
        "
      />
    </a>
  );
}

export default Logo;