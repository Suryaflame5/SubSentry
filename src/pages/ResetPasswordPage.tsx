import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordRequirements } from '../components/auth/PasswordRequirements';
import { useAuth } from '../context/AuthContext';
import { useSubSentry } from '../context/SubSentryContext';

export const ResetPasswordPage: React.FC = () => {
  const { activeResetToken, submitReset } = useAuth();
  const { setCurrentRoute } = useSubSentry();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!activeResetToken) {
      setError('This reset link has expired. Request a new one.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await submitReset(activeResetToken, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'This reset link has expired. Request a new one.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          {isSuccess ? 'Password updated' : 'Create a new password'}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isSuccess
            ? 'Your password has been updated. You can now sign in.'
            : 'Enter a secure password for your SubSentry account.'}
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3.5 rounded-md bg-positive/10 border border-positive/20 text-xs text-positive font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password successfully updated.</span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentRoute('/signin')}
            className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-xs"
          >
            Sign in
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-md bg-warning/10 border border-warning/30 text-xs text-warning font-medium leading-relaxed"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <PasswordField
                label="New password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="new-password"
                required
                autoFocus
              />
              <PasswordRequirements password={newPassword} />
            </div>

            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              autoComplete="new-password"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden shadow-xs mt-2"
            >
              {isSubmitting ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
