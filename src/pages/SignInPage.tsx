import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { PasswordField } from '../components/auth/PasswordField';
import { useAuth } from '../context/AuthContext';
import { useSubSentry } from '../context/SubSentryContext';
import { PageRoute } from '../types';

export const SignInPage: React.FC = () => {
  const { signIn } = useAuth();
  const { setCurrentRoute } = useSubSentry();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getReturnTo = (): PageRoute => {
    try {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const params = new URLSearchParams(hash.substring(queryIdx));
        const returnTo = params.get('returnTo');
        if (returnTo && returnTo.startsWith('/')) {
          return returnTo as PageRoute;
        }
      }
    } catch {
      // Fallback to overview
    }
    return '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      const destination = getReturnTo();
      setCurrentRoute(destination);
    } catch (err: any) {
      setError(err?.message || 'Email or password is incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Sign in to SubSentry
        </h1>
        <p className="text-xs text-secondary mt-1">
          Continue to your transaction analysis.
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
          autoFocus
        />

        <PasswordField
          label="Password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          autoComplete="current-password"
          required
          rightLabelAction={
            <button
              type="button"
              onClick={() => setCurrentRoute('/forgot-password')}
              className="text-[11px] text-secondary hover:text-primary transition-colors focus:outline-hidden"
            >
              Forgot password?
            </button>
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden shadow-xs mt-2"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-border/70 text-center text-xs text-secondary">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => setCurrentRoute('/signup')}
          className="font-medium text-primary hover:underline underline-offset-2 transition-colors focus:outline-hidden"
        >
          Create account
        </button>
      </div>
    </AuthLayout>
  );
};
