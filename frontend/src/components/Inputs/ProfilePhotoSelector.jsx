import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, disabled = false }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onChooseFile = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        disabled={disabled}
        className="hidden"
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-green-100 dark:bg-green-950/60 rounded-full relative border-2 border-green-200 dark:border-green-800/80 shadow-sm">
          <LuUser className="text-4xl text-green-500 dark:text-green-400" />
          <button
            type="button"
            disabled={disabled}
            className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full absolute -bottom-0.5 -right-0.5 cursor-pointer shadow-md transition-colors"
            onClick={onChooseFile}
            title="Upload photo"
            aria-label="Upload photo"
          >
            <LuUpload size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-md"
          />
          <button
            type="button"
            disabled={disabled}
            className="w-7 h-7 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-full absolute -bottom-0.5 -right-0.5 cursor-pointer shadow-md transition-colors"
            onClick={handleRemoveImage}
            title="Remove photo"
            aria-label="Remove photo"
          >
            <LuTrash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;