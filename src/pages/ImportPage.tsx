import React, { useState } from 'react';
import { ImportDropzone } from '../components/import/ImportDropzone';
import { ProcessingPipeline } from '../components/import/ProcessingPipeline';

export const ImportPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Import transaction data
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Bring your transaction history into SubSentry for explainable pattern analysis.
        </p>
      </div>

      {isProcessing ? (
        <ProcessingPipeline onComplete={() => setIsProcessing(false)} />
      ) : (
        <ImportDropzone onStartProcessing={() => setIsProcessing(true)} />
      )}
    </div>
  );
};
