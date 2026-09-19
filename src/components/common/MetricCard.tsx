import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  delta?: {
    text: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  indicator?: 'default' | 'accent' | 'warning' | 'positive';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  delta,
  onClick,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`relative bg-surface rounded-lg border border-border p-5 transition-all duration-150 ${
        isClickable
          ? 'cursor-pointer hover:border-accent/50 hover:shadow-card hover:-translate-y-0.5'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-secondary uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl font-semibold tracking-tight text-primary tabular-nums">
          {value}
        </span>
        {delta && (
          <span
            className={`text-xs font-medium tabular-nums ${
              delta.isNeutral
                ? 'text-secondary'
                : delta.isPositive
                ? 'text-positive'
                : 'text-warning'
            }`}
          >
            {delta.text}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-secondary leading-relaxed font-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
