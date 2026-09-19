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

interface UserMenuProps {
  compact?: boolean;
  direction?: 'up' | 'down';
  fullWidth?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  compact = false,
  direction = 'down',
  fullWidth = false,
}) => {
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

  const menuPositionClass =
    direction === 'up'
      ? 'absolute left-0 bottom-full mb-2 w-full min-w-[220px] rounded-lg bg-surface border border-border shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100'
      : 'absolute right-0 top-full mt-1.5 w-56 rounded-lg bg-surface border border-border shadow-md py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100';

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} text-left`} ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-md text-left transition-colors hover:bg-surface-subtle focus:outline-hidden ${
          fullWidth ? 'w-full justify-between p-1.5' : compact ? 'p-1' : 'px-2 py-1.5'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-md bg-accent/15 text-accent font-mono font-semibold text-xs flex items-center justify-center tracking-tight border border-accent/20 shrink-0 select-none">
            {initials}
          </div>

          {!compact && (
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-xs font-semibold text-primary truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-secondary truncate">
                {user.email}
              </div>
            </div>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-secondary shrink-0 transition-transform duration-150 ${
            isOpen ? (direction === 'up' ? '' : 'rotate-180') : direction === 'up' ? 'rotate-180' : ''
          } ${isOpen ? 'text-primary' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={menuPositionClass}
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
