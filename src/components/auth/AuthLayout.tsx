import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-primary antialiased">
      {/* Top Header Spacing */}
      <div className="pt-2 sm:pt-6 flex justify-center">
        <a
          href="#/"
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-md bg-primary text-surface font-mono font-bold text-xs flex items-center justify-center tracking-tight shadow-xs">
            SS
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-primary uppercase">
              SUBSENTRY
            </div>
            <div className="text-[10px] text-secondary tracking-tight font-normal">
              Recurring Payment Analysis
            </div>
          </div>
        </a>
      </div>

      {/* Main Centered Form Card */}
      <div className="w-full max-w-[420px] mx-auto my-6">
        <div className="bg-surface border border-border rounded-lg shadow-xs p-6 sm:p-8">
          {children}
        </div>

        {/* Quiet Privacy Note */}
        <p className="text-center text-[11px] text-muted mt-4">
          Your transaction history is only available inside your account.
        </p>
      </div>

      {/* Bottom Legal Links */}
      <footer className="pb-4 text-center text-xs text-secondary">
        <div className="flex items-center justify-center gap-3">
          <a
            href="#/privacy"
            className="hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            Privacy
          </a>
          <span>·</span>
          <a
            href="#/terms"
            className="hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
};
