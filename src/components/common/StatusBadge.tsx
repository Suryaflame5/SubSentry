import React from 'react';
import { EntityStatus } from '../../types';

interface StatusBadgeProps {
  status: EntityStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  if (normalized === 'active') {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-xs text-positive">
        Active
      </span>
    );
  }

  if (normalized === 'review' || normalized === 'review candidate') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-xs text-warning">
        <span>Review</span>
        <span className="text-[11px] font-mono">↗</span>
      </span>
    );
  }

  if (normalized === 'intentional' || normalized === 'kept') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-xs text-accent">
        <span>Intentional</span>
        <span className="text-[11px] font-mono">✓</span>
      </span>
    );
  }

  if (normalized === 'dismissed') {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-xs text-secondary">
        <span>Dismissed</span>
        <span className="text-[11px] font-mono">—</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      One-time
    </span>
  );
};
