import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;