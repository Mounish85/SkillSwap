import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  as = 'input',
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  options = [],
  className = '',
  rows = 4,
  name,
  id,
  ...props
}) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const baseInputStyles =
    'w-full px-5 py-3.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const errorInputStyles = error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : '';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-white/80 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-fuchsia-400 ml-1">*</span>}
          </span>
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${baseInputStyles} ${errorInputStyles} resize-y`}
          {...props}
        />
      ) : as === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${baseInputStyles} ${errorInputStyles} [&>option]:bg-slate-900 [&>option]:text-white`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${baseInputStyles} ${errorInputStyles}`}
          {...props}
        />
      )}

      {error && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 mt-0.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-white/50">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

