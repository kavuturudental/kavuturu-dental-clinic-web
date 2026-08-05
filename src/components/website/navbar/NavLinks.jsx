import navigationData from "../../../data/website/navigationData";

import NavLinkItem from "./NavLinkItem";
import TreatmentsDropdown from "./TreatmentsDropdown";

function NavLinks({
  activeSection,
  setActiveSection,
  onLinkClick,
  mobile = false,
}) {
  return (
    <nav aria-label="Primary Navigation">
      <ul
        className={
          mobile
            ? "flex flex-col gap-1"
            : "hidden items-center gap-10 lg:flex"
        }
      >
        {navigationData.map((item) => {
          if (item.hasDropdown && !mobile) {
            return (
              <TreatmentsDropdown
                key={item.id}
                activeSection={activeSection}
              />
            );
          }

          return (
            <NavLinkItem
              key={item.id}
              item={item}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onClick={onLinkClick}
              mobile={mobile}
            />
          );
        })}
      </ul>
    </nav>
  );
}

export default NavLinks;