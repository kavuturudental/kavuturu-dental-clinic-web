import React from "react";
import clsx from "clsx";

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-[24px] border border-slate-100 shadow-[0_12px_36px_rgba(0,0,0,0.02)] p-6 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
