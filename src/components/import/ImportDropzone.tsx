import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Shield, ArrowRight, Download, AlertCircle } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { parseTransactionCSV, generateCSVTemplate } from '../../utils/csvParser';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface ImportDropzoneProps {
  onStartProcessing: () => void;
}

export const ImportDropzone: React.FC<ImportDropzoneProps> = ({ onStartProcessing }) => {
  const { importCustomTransactions, resetToSampleData } = useSubSentry();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    size: string;
    count: number;
    preview: Transaction[];
  } | null>(null);
  const [parsedTransactions, setParsedTransactions] = useState<Transaction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('PDF statements require text extraction which is not locally configured. Please upload a CSV statement.');
      } else {
        setErrorMessage('Unsupported file format. SubSentry accepts CSV (.csv) transaction statements.');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseTransactionCSV(text);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to parse CSV file.');
        setSelectedFileMeta(null);
        setParsedTransactions([]);
        return;
      }

      setParsedTransactions(result.transactions);
      setSelectedFileMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        count: result.rowCount,
        preview: result.transactions.slice(0, 3),
      });
    };

    reader.onerror = () => {
      setErrorMessage('Could not read the uploaded file. Please check file permissions and try again.');
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (parsedTransactions.length > 0) {
      importCustomTransactions(parsedTransactions);
      onStartProcessing();
    }
  };

  const handleUseBenchmark = () => {
    resetToSampleData();
    onStartProcessing();
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subsentry_statement_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRemove = () => {
    setSelectedFileMeta(null);
    setParsedTransactions([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-warning-subtle/50 border border-warning/40 flex items-start gap-3 text-xs text-primary animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-warning">Import validation error</div>
            <p className="text-secondary leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* File Upload / Selected State */}
      {selectedFileMeta ? (
        <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-primary">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">{selectedFileMeta.name}</h4>
                <div className="text-xs text-secondary mt-0.5 flex items-center gap-2">
                  <span>{selectedFileMeta.size}</span>
                  <span>•</span>
                  <span>{selectedFileMeta.count} transactions validated</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-subtle transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Statement records preview */}
          <div className="space-y-1.5 pt-2 border-t border-border/70">
            <div className="text-[10px] text-secondary uppercase font-semibold">
              First {selectedFileMeta.preview.length} records preview
            </div>
            <div className="divide-y divide-border/60 border border-border/60 rounded-md overflow-hidden text-xs bg-surface-subtle/30">
              {selectedFileMeta.preview.map((tx, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary">{tx.merchantNormalized}</div>
                    <div className="text-[11px] text-muted">{tx.date} • {tx.category}</div>
                  </div>
                  <div className="font-bold text-primary tabular-nums">
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <button
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
            >
              <span>Analyze {selectedFileMeta.count} transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-accent bg-accent-subtle/50'
              : 'border-border hover:border-accent/60 bg-surface hover:bg-surface-subtle/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto mb-3 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6 text-accent" />
          </div>

          <h3 className="text-base font-bold text-primary tracking-tight">
            Drop transaction export here
          </h3>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
            Select or drag and drop a transaction statement in CSV format.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted font-mono">
            <FileText className="w-3.5 h-3.5 text-secondary" />
            <span>Accepts .csv with Date, Description, and Amount columns</span>
          </div>
        </div>
      )}

      {/* CSV Template & Benchmark Statement Box */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Statement Template
          </div>
          <h4 className="text-sm font-bold text-primary">
            Download standard format or load benchmark
          </h4>
          <p className="text-xs text-secondary max-w-md">
            Need a pre-formatted statement? Download our CSV template or test with our 40-record benchmark statement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-secondary" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleUseBenchmark}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
          >
            <span>Load benchmark statement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privacy Notice Panel */}
      <div className="p-4 rounded-lg bg-surface-subtle border border-border flex items-start gap-3 text-xs text-secondary">
        <Shield className="w-4 h-4 text-positive shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-primary">Your data stays on your machine.</div>
          <p className="text-[11px] leading-relaxed text-secondary">
            SubSentry executes transaction pattern analysis entirely in your local browser runtime. No financial credentials or bank credentials are ever required.
          </p>
        </div>
      </div>
    </div>
  );
};
