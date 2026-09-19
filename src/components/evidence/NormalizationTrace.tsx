import React from 'react';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface NormalizationTraceProps {
  rawDescriptors: string[];
  normalizedName: string;
  category: string;
}

export const NormalizationTrace: React.FC<NormalizationTraceProps> = ({
  rawDescriptors,
  normalizedName,
  category,
}) => {
  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          Merchant Normalization Trace
        </h4>
        <span className="text-[11px] text-positive bg-positive-subtle px-2 py-0.5 rounded border border-positive-border font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Clean Entity
        </span>
      </div>

      <div className="space-y-2 pt-1">
        {rawDescriptors.map((raw, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-md bg-surface-subtle border border-border text-xs"
          >
            <div className="min-w-0">
              <div className="text-[10px] text-muted font-mono uppercase">
                Raw Transaction String
              </div>
              <div className="font-mono text-xs text-primary font-medium truncate mt-0.5">
                {raw}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ArrowRight className="w-3.5 h-3.5 text-muted hidden sm:block" />
              <div className="text-right">
                <div className="text-[10px] text-muted uppercase">Normalized</div>
                <div className="font-semibold text-primary">{normalizedName}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 text-xs border-t border-border/70 text-secondary">
        <span>
          Assigned Category: <strong className="text-primary font-medium">{category}</strong>
        </span>
        <span className="text-[11px] text-muted">
          Rule-based tokenizer & pattern grouping
        </span>
      </div>
    </div>
  );
};
