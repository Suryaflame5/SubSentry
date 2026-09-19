import React from 'react';

interface ConfidenceBadgeProps {
  confidence: number;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  size = 'md',
}) => {
  if (size === 'lg') {
    return (
      <div className="space-y-0.5">
        <div className="text-[11px] text-secondary uppercase font-medium tracking-wider">
          Recurrence confidence
        </div>
        <div className="text-2xl font-bold text-primary tabular-nums">
          {confidence}%
        </div>
      </div>
    );
  }

  return (
    <span className="text-xs text-secondary font-normal tabular-nums">
      <strong className="font-semibold text-primary">{confidence}%</strong> recurrence confidence
    </span>
  );
};

