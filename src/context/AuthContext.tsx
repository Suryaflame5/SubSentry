import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '../types';
import {
  getCurrentSession,
  createUser,
  authenticateUser,
  terminateSession,
  confirmEmailVerification,
  requestPasswordReset as reqReset,
  executePasswordReset,
  changeUserPassword,
  removeUserAccount,
} from '../utils/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  pendingVerificationEmail: string | null;
  pendingVerificationUser: User | null;
  activeResetToken: string | null;
  setPendingVerificationEmail: (email: string | null) => void;
  setPendingVerificationUser: (user: User | null) => void;
  setActiveResetToken: (token: string | null) => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<User>;
  signOut: () => void;
  verifyCurrentEmail: (userId: string) => Promise<void>;
  requestReset: (email: string) => Promise<{ resetToken?: string }>;
  submitReset: (token: string, newPass: string) => Promise<void>;
  updatePassword: (oldPass: string, newPass: string) => Promise<void>;
  deleteCurrentAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [pendingVerificationUser, setPendingVerificationUser] = useState<User | null>(null);
  const [activeResetToken, setActiveResetToken] = useState<string | null>(null);

  // Restore session on initial load
  useEffect(() => {
    try {
      const active = getCurrentSession();
      if (active) {
        setUser(active.user);
        setSession(active.session);
      }
    } catch {
      // Ignore parse error and keep user null
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string): Promise<void> => {
    const res = await authenticateUser(email, pass);
    setUser(res.user);
    setSession(res.session);
    setPendingVerificationEmail(null);
    setPendingVerificationUser(null);
  };

  const signUp = async (name: string, email: string, pass: string): Promise<User> => {
    const res = await createUser(name, email, pass);
    setPendingVerificationEmail(res.user.email);
    setPendingVerificationUser(res.user);
    return res.user;
  };

  const signOut = () => {
    terminateSession();
    setUser(null);
    setSession(null);
  };

  const verifyCurrentEmail = async (userId: string): Promise<void> => {
    const updated = confirmEmailVerification(userId);
    // If this is the pending user, authenticate them
    if (pendingVerificationUser && pendingVerificationUser.id === userId) {
      setUser(updated);
      const sessionObj: Session = {
        token: `ses_${Math.random().toString(36).substring(2)}`,
        userId: updated.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem('subsentry:session', JSON.stringify(sessionObj));
      setSession(sessionObj);
      setPendingVerificationEmail(null);
      setPendingVerificationUser(null);
    } else if (user && user.id === userId) {
      setUser(updated);
    }
  };

  const requestReset = async (email: string): Promise<{ resetToken?: string }> => {
    const res = reqReset(email);
    if (res.resetToken) {
      setActiveResetToken(res.resetToken);
    }
    return res;
  };

  const submitReset = async (token: string, newPass: string): Promise<void> => {
    await executePasswordReset(token, newPass);
    setActiveResetToken(null);
  };

  const updatePassword = async (oldPass: string, newPass: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await changeUserPassword(user.id, oldPass, newPass);
  };

  const deleteCurrentAccount = async (): Promise<void> => {
    if (!user) return;
    removeUserAccount(user.id);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        pendingVerificationEmail,
        pendingVerificationUser,
        activeResetToken,
        setPendingVerificationEmail,
        setPendingVerificationUser,
        setActiveResetToken,
        signIn,
        signUp,
        signOut,
        verifyCurrentEmail,
        requestReset,
        submitReset,
        updatePassword,
        deleteCurrentAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
