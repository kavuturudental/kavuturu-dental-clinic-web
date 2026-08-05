import React from "react";
import clsx from "clsx";

const Table = ({ headers, children, className, ...props }) => {
  return (
    <div className={clsx("overflow-x-auto w-full", className)} {...props}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
