import React, { useState } from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  RefreshCw,
  Sliders,
  Download,
  Calendar,
  DollarSign,
  User as UserIcon,
  Key,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordRequirements } from '../components/auth/PasswordRequirements';

export const SettingsPage: React.FC = () => {
  const { resetToSampleData, setCurrentRoute } = useSubSentry();
  const { user, signOut, updatePassword, deleteCurrentAccount } = useAuth();

  const [sensitivity, setSensitivity] = useState(85);
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = () => {
    setCurrentRoute('/report');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordSubmitting(true);

    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordSuccess('Password successfully changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteCurrentAccount();
      setIsDeleteModalOpen(false);
      setCurrentRoute('/signin');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setCurrentRoute('/signin');
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Settings
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Account security, detection sensitivity, currency, and local data handling.
        </p>
      </div>

      {/* Account Section */}
      {user && (
        <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/20 text-accent flex items-center justify-center font-mono font-semibold text-xs">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary">Account details</h3>
                <p className="text-[11px] text-secondary">Authenticated user workspace</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-secondary hover:text-primary hover:bg-surface-subtle border border-border rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-md bg-surface-subtle/50 border border-border/70">
              <span className="text-[11px] text-secondary block">Full name</span>
              <span className="font-semibold text-primary mt-0.5 block">{user.name}</span>
            </div>
            <div className="p-3 rounded-md bg-surface-subtle/50 border border-border/70">
              <span className="text-[11px] text-secondary block">Email address</span>
              <span className="font-semibold text-primary mt-0.5 block">{user.email}</span>
            </div>
          </div>

          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-positive/10 border border-positive/20 text-xs text-positive font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {/* Change Password Form or Trigger */}
          <div className="pt-2 border-t border-border/70">
            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md pt-2">
                <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-accent" />
                  <span>Update password</span>
                </div>

                {passwordError && (
                  <div className="p-2.5 rounded-md bg-warning/10 border border-warning/30 text-xs text-warning font-medium">
                    {passwordError}
                  </div>
                )}

                <PasswordField
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <PasswordField
                    label="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <PasswordRequirements password={newPassword} />
                </div>

                <PasswordField
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="px-3.5 py-1.5 bg-primary text-surface text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isPasswordSubmitting ? 'Updating…' : 'Save new password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError(null);
                    }}
                    className="px-3 py-1.5 text-xs text-secondary hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Password & Security</div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Hashed with Web Crypto SHA-256 + cryptographic salt
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-subtle border border-border rounded-md transition-colors"
                >
                  Change password
                </button>
              </div>
            )}
          </div>

          {/* Delete Account Danger Zone */}
          <div className="pt-4 border-t border-border/70 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-warning">Delete account</div>
              <div className="text-[11px] text-secondary mt-0.5">
                Permanently deletes your account and all associated transaction records.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-warning hover:bg-warning/10 border border-warning/30 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account</span>
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Privacy & Data Handling */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Shield className="w-4 h-4 text-positive" />
          <span>Data handling & privacy</span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          SubSentry operates on an isolation-first architecture. Financial transactions are stored and analyzed locally within your authenticated account workspace.
        </p>
        <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs text-secondary">
          <strong>Explainability principle:</strong> Transparent scoring based on frequency, interval consistency, amount stability, and merchant identity verification.
        </div>
      </div>

      {/* Section 2: Recurrence Sensitivity */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Detection sensitivity threshold</span>
          </div>
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-subtle border border-border">
            {sensitivity}%
          </span>
        </div>

        <p className="text-xs text-secondary">
          Payment patterns scoring at or above this threshold are classified as recurring.
        </p>

        <input
          type="range"
          min="70"
          max="95"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-muted font-mono">
          <span>70% (Inclusive - captures variable utility bills)</span>
          <span>85% (Standard)</span>
          <span>95% (Strict - exact fixed subscriptions only)</span>
        </div>
      </div>

      {/* Section 3: Currency Standard */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <DollarSign className="w-4 h-4 text-secondary" />
          <span>Currency formatting</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => setCurrency('INR')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              currency === 'INR'
                ? 'bg-accent/10 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">Indian Rupee (₹ INR)</div>
            <div className="text-[11px] text-muted mt-0.5">Indian comma notation (e.g. ₹6,240)</div>
          </div>
          <div
            onClick={() => setCurrency('USD')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              currency === 'USD'
                ? 'bg-accent/10 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">US Dollar ($ USD)</div>
            <div className="text-[11px] text-muted mt-0.5">International standard grouping</div>
          </div>
        </div>
      </div>

      {/* Section 4: Date Format */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Calendar className="w-4 h-4 text-secondary" />
          <span>Date format</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => setDateFormat('DD/MM/YYYY')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              dateFormat === 'DD/MM/YYYY'
                ? 'bg-accent/10 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">DD Mon YYYY (Default)</div>
            <div className="text-[11px] text-muted mt-0.5">e.g. 05 May 2026</div>
          </div>
          <div
            onClick={() => setDateFormat('YYYY-MM-DD')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              dateFormat === 'YYYY-MM-DD'
                ? 'bg-accent/10 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">ISO Format (YYYY-MM-DD)</div>
            <div className="text-[11px] text-muted mt-0.5">e.g. 2026-05-05</div>
          </div>
        </div>
      </div>

      {/* Section 5: Data Management */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
        <div className="text-sm font-bold text-primary">
          Data management
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={resetToSampleData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            <span>Load benchmark transactions</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-secondary hover:text-primary bg-surface hover:bg-surface-subtle border border-border rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View printable report</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-surface border border-border rounded-lg max-w-md w-full p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-warning/10 border border-warning/20 text-warning flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">
                  Delete SubSentry account?
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Deleting your account will remove your login credentials, personal profile, and all locally stored transaction statements and recurring payment patterns.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs text-secondary hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold text-surface bg-warning hover:bg-warning/90 rounded-md transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Yes, delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
