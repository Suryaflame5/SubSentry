import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useSubSentry();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-positive shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-surface rounded-lg border border-border shadow-dropdown p-4 flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-primary">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-secondary mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={dismissToast}
          className="text-secondary hover:text-primary transition-colors p-1 -mr-1 -mt-1 rounded hover:bg-surface-subtle"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
