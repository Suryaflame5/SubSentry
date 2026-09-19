import React from 'react';
import { TransactionTable } from '../components/transactions/TransactionTable';

export const TransactionsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Transactions
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Every transaction behind the recurrence analysis.
        </p>
      </div>

      <TransactionTable />
    </div>
  );
};
