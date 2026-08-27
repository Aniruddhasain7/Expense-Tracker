import React from "react";
import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${
        style || "bg-slate-100 dark:bg-[#181818] text-slate-800 dark:text-gray-200"
      } flex items-center justify-center rounded-full text-gray-900 font-medium`}
    >
      {getInitials(fullName || "")}
    </div>
  );
};

export default CharAvatar;