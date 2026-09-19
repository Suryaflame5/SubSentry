import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordRequirements } from '../components/auth/PasswordRequirements';
import { useAuth } from '../context/AuthContext';
import { useSubSentry } from '../context/SubSentryContext';

export const SignUpPage: React.FC = () => {
  const { signUp } = useAuth();
  const { setCurrentRoute } = useSubSentry();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signUp(name, email, password);
      // Navigate to email verification state
      setCurrentRoute('/verify-email');
    } catch (err: any) {
      setError(err?.message || "We couldn't create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Create your SubSentry account
        </h1>
        <p className="text-xs text-secondary mt-1">
          Set up your workspace to analyze recurring payments.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-md bg-warning/10 border border-warning/30 text-xs text-warning font-medium leading-relaxed"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          label="Full name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Surya Narayanan"
          autoComplete="name"
          required
          autoFocus
        />

        <AuthField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <div className="space-y-2">
          <PasswordField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            autoComplete="new-password"
            required
          />
          <PasswordRequirements password={password} />
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-border/70 text-center text-xs text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setCurrentRoute('/signin')}
          className="font-medium text-primary hover:underline underline-offset-2 transition-colors focus:outline-hidden"
        >
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
};
