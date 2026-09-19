import React, { useState } from 'react';
import { Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useSubSentry } from '../context/SubSentryContext';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'your email';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function getWebmailProvider(email: string): { label: string; url: string } {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  if (domain.includes('gmail') || domain.includes('googlemail')) {
    return { label: 'Open Gmail', url: 'https://mail.google.com' };
  }
  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) {
    return { label: 'Open Outlook', url: 'https://outlook.live.com/mail/' };
  }
  if (domain.includes('yahoo')) {
    return { label: 'Open Yahoo Mail', url: 'https://mail.yahoo.com' };
  }
  if (domain.includes('icloud')) {
    return { label: 'Open iCloud Mail', url: 'https://www.icloud.com/mail' };
  }
  // Default to Gmail for webmail users
  return { label: 'Open Gmail', url: 'https://mail.google.com' };
}

export const VerifyEmailPage: React.FC = () => {
  const { pendingVerificationEmail, pendingVerificationUser, verifyCurrentEmail } = useAuth();
  const { setCurrentRoute } = useSubSentry();

  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const displayEmail = pendingVerificationEmail || pendingVerificationUser?.email || 'your email';
  const maskedEmail = maskEmail(displayEmail);
  const provider = getWebmailProvider(displayEmail);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendStatus('Verification email sent.');
    }, 600);
  };

  const handleCompleteVerification = async () => {
    if (!pendingVerificationUser) {
      setCurrentRoute('/signin');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyCurrentEmail(pendingVerificationUser.id);
      // New user goes to import workflow to upload transactions
      setCurrentRoute('/import');
    } catch {
      setCurrentRoute('/signin');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-3">
          <Mail className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Verify your email
        </h1>
        <p className="text-xs text-secondary mt-1">
          Confirm your email address to continue to SubSentry.
        </p>
      </div>

      <div className="p-4 rounded-md bg-canvas border border-border/80 text-center mb-5">
        <p className="text-xs text-secondary">
          We sent a verification link to
        </p>
        <p className="text-xs font-mono font-medium text-primary mt-1">
          {maskedEmail}
        </p>
      </div>

      {resendStatus && (
        <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-positive font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{resendStatus}</span>
        </div>
      )}

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleCompleteVerification}
          disabled={isVerifying}
          className="w-full py-2.5 px-4 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden shadow-xs"
        >
          {isVerifying ? 'Verifying…' : 'Verify email now'}
        </button>

        <a
          href={provider.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-center border border-border text-xs font-medium text-primary hover:bg-surface-subtle rounded-md transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-secondary" />
          <span>{provider.label}</span>
        </a>

        <div className="text-center pt-1">
          <a
            href={`mailto:${displayEmail}`}
            className="text-[11px] text-muted hover:text-secondary transition-colors underline-offset-2 hover:underline"
          >
            Or open system mail app
          </a>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-secondary">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="hover:text-primary transition-colors hover:underline underline-offset-2 disabled:opacity-50"
          >
            {isResending ? 'Sending…' : 'Resend verification email'}
          </button>

          <button
            type="button"
            onClick={() => setCurrentRoute('/signup')}
            className="hover:text-primary transition-colors hover:underline underline-offset-2"
          >
            Change email address
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
