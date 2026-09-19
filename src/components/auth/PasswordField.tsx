import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  rightLabelAction?: React.ReactNode;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  helperText,
  rightLabelAction,
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
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
        {rightLabelAction ? (
          rightLabelAction
        ) : helperText && !error ? (
          <span className="text-[11px] text-secondary">{helperText}</span>
        ) : null}
      </div>

      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`w-full pl-3 pr-9 py-2 text-xs text-primary bg-surface border rounded-md transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent ${
            error ? 'border-warning/70 focus:border-warning' : 'border-border'
          } ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors p-0.5 rounded focus:outline-hidden"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-warning font-medium mt-1">{error}</p>
      )}
    </div>
  );
};
