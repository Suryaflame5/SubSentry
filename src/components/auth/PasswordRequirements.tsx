import React from 'react';
import { Check } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const isMinLength = password.length >= 8;

  if (!password) {
    return (
      <p className="text-[11px] text-secondary">
        Password must be at least 8 characters.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[11px] transition-colors">
      <span
        className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
          isMinLength
            ? 'bg-positive/10 text-positive'
            : 'bg-surface-subtle text-muted'
        }`}
      >
        <Check className="w-2.5 h-2.5" />
      </span>
      <span className={isMinLength ? 'text-primary font-medium' : 'text-secondary'}>
        At least 8 characters
      </span>
    </div>
  );
};
