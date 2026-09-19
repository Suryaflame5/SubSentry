import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { useAuth } from '../context/AuthContext';
import { useSubSentry } from '../context/SubSentryContext';

export const ForgotPasswordPage: React.FC = () => {
  const { requestReset, activeResetToken } = useAuth();
  const { setCurrentRoute } = useSubSentry();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      await requestReset(email);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Reset your password
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isSubmitted
            ? 'Instructions have been dispatched.'
            : "Enter your email and we'll send you a reset link."}
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-canvas border border-border/80 text-xs text-secondary leading-relaxed">
            If an account exists for <span className="font-medium text-primary">{email}</span>, you&apos;ll receive instructions to reset your password.
          </div>

          {activeResetToken && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentRoute('/reset-password')}
                className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-xs"
              >
                Proceed to create new password ↗
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setCurrentRoute('/signin')}
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors focus:outline-hidden"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden shadow-xs mt-2"
          >
            {isSubmitting ? 'Sending link…' : 'Send reset link'}
          </button>

          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={() => setCurrentRoute('/signin')}
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors focus:outline-hidden"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
