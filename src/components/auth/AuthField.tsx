import React from 'react';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `field_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-primary"
        >
          {label}
        </label>
        {helperText && !error && (
          <span className="text-[11px] text-secondary">{helperText}</span>
        )}
      </div>

      <input
        id={inputId}
        className={`w-full px-3 py-2 text-xs text-primary bg-surface border rounded-md transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent ${
          error ? 'border-warning/70 focus:border-warning' : 'border-border'
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="text-[11px] text-warning font-medium mt-1">{error}</p>
      )}
    </div>
  );
};
