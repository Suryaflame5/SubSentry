import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubSentry } from '../../context/SubSentryContext';

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const UserMenu: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { user, signOut } = useAuth();
  const { setCurrentRoute } = useSubSentry();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = getInitials(user.name);

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
    setCurrentRoute('/signin');
  };

  const handleGoSettings = () => {
    setIsOpen(false);
    setCurrentRoute('/settings');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 p-1 rounded-md text-left transition-colors hover:bg-surface-subtle focus:outline-hidden ${
          compact ? '' : 'px-2 py-1.5'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="w-7 h-7 rounded-md bg-accent/15 text-accent font-mono font-semibold text-xs flex items-center justify-center tracking-tight border border-accent/20 select-none">
          {initials}
        </div>

        {!compact && (
          <div className="hidden sm:block leading-tight pr-1">
            <div className="text-xs font-semibold text-primary truncate max-w-[120px]">
              {user.name}
            </div>
            <div className="text-[10px] text-secondary truncate max-w-[120px]">
              {user.email}
            </div>
          </div>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-secondary transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 bottom-full sm:bottom-auto sm:top-full sm:mt-1.5 mb-1.5 sm:mb-0 w-56 rounded-lg bg-surface border border-border shadow-md py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Details Header */}
          <div className="px-3.5 py-2 border-b border-border/70">
            <div className="text-xs font-semibold text-primary truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-secondary truncate mt-0.5">
              {user.email}
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={handleGoSettings}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-secondary hover:text-primary hover:bg-surface-subtle transition-colors text-left"
              role="menuitem"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-secondary hover:text-primary hover:bg-surface-subtle transition-colors text-left"
              role="menuitem"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
