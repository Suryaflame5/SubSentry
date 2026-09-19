import React, { useState } from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { Database, Trash2, UploadCloud, Shield, AlertTriangle } from 'lucide-react';

export const DatasetsPage: React.FC = () => {
  const {
    totalTransactionsCount,
    datasetName,
    datasetImportDate,
    clearDataset,
    setCurrentRoute,
  } = useSubSentry();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const hasData = totalTransactionsCount > 0;

  const handleConfirmClear = () => {
    clearDataset();
    setShowClearConfirm(false);
    setCurrentRoute('/');
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Transaction history
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Active transaction file, ingestion records, and storage management.
        </p>
      </div>

      {/* Active Dataset Status Card */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-primary">
              <Database className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">
                {datasetName}
              </h3>
              <div className="text-xs text-secondary mt-0.5 flex items-center gap-2">
                <span>{hasData ? `${totalTransactionsCount} transactions` : 'No transactions loaded'}</span>
                {hasData && (
                  <>
                    <span>•</span>
                    <span>Imported {datasetImportDate}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold text-primary">
            {hasData ? 'Active' : 'No Data'}
          </span>
        </div>

        {/* Dataset Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-md bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-medium">Transactions</div>
            <div className="font-bold text-primary mt-1 text-sm tabular-nums">
              {totalTransactionsCount}
            </div>
          </div>

          <div className="p-3 rounded-md bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-medium">Imported</div>
            <div className="font-semibold text-primary mt-1 text-xs">
              {hasData ? datasetImportDate : '—'}
            </div>
          </div>

          <div className="p-3 rounded-md bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-medium">Last Analyzed</div>
            <div className="font-semibold text-primary mt-1 text-xs">
              {hasData ? 'Today, 10:42 AM' : '—'}
            </div>
          </div>

          <div className="p-3 rounded-md bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-medium">Data Mode</div>
            <div className="font-semibold text-primary mt-1 text-xs">
              Local Sandbox
            </div>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentRoute('/import')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{hasData ? 'Replace file' : 'Import transactions'}</span>
          </button>

          {hasData && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-warning hover:text-warning/80 hover:bg-surface-subtle border border-border rounded-md transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear data</span>
            </button>
          )}
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-border p-6 max-w-md w-full shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-warning-subtle text-warning flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-primary">
                  Clear transaction history?
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  This removes the current analysis and returns SubSentry to the import screen.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 text-xs font-semibold text-surface bg-warning hover:bg-warning/90 rounded-md transition-colors"
              >
                Clear data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Panel */}
      <div className="p-4 rounded-lg bg-surface-subtle border border-border flex items-start gap-3 text-xs text-secondary">
        <Shield className="w-4 h-4 text-positive shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-primary">Local Browser Storage</div>
          <p className="text-[11px] leading-relaxed text-secondary">
            SubSentry stores parsed statements strictly in your browser's local sandbox storage. No banking credentials or external server relays are used.
          </p>
        </div>
      </div>
    </div>
  );
};
