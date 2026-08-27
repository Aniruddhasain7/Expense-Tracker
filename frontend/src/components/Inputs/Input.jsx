import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  autoCapitalize,
  autoCorrect,
  spellCheck,
  inputMode,
  disabled = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isEmail = type === "email";
  const resolvedAutoCapitalize = autoCapitalize ?? (isEmail ? "none" : undefined);
  const resolvedAutoCorrect = autoCorrect ?? (isEmail ? "off" : undefined);
  const resolvedSpellCheck = spellCheck ?? (isEmail ? false : undefined);
  const resolvedInputMode = inputMode ?? (isEmail ? "email" : undefined);

  return (
    <div className="w-full">
      {label && (
        <label className="text-[13px] font-medium text-slate-800 dark:text-slate-200 transition-colors">
          {label}
        </label>
      )}

      <div
        className={`input-box flex items-center gap-2 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm disabled:cursor-not-allowed"
          value={value}
          onChange={onChange}
          autoCapitalize={resolvedAutoCapitalize}
          autoCorrect={resolvedAutoCorrect}
          spellCheck={resolvedSpellCheck}
          inputMode={resolvedInputMode}
          disabled={disabled}
          {...rest}
        />

        {type === "password" && (
          <button
            type="button"
            className="focus:outline-none cursor-pointer"
            onClick={toggleShowPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <FaRegEye
                size={20}
                className="text-green-500 hover:text-green-600 dark:text-green-400 transition-colors"
              />
            ) : (
              <FaRegEyeSlash
                size={20}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
