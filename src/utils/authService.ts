import { User, Session } from '../types';

const STORAGE_USERS_KEY = 'subsentry:users';
const STORAGE_SESSION_KEY = 'subsentry:session';

/**
 * Generate cryptographically secure random hex string
 */
function generateRandomHex(byteCount = 16): string {
  const bytes = new Uint8Array(byteCount);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compute SHA-256 hash of salt + password using browser SubtleCrypto
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Retrieve all registered users from user storage
 */
export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

/**
 * Register a new user with hashed password and verification token
 */
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; verificationToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const salt = generateRandomHex(16);
  const passwordHash = await hashPassword(password, salt);
  const verificationToken = generateRandomHex(24);

  const newUser: User = {
    id: `usr_${generateRandomHex(8)}`,
    name: name.trim(),
    email: normalizedEmail,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    passwordHash,
    salt,
    verificationToken,
  };

  users.push(newUser);
  saveUsers(users);

  return { user: newUser, verificationToken };
}

/**
 * Authenticate credentials and return user + new session
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    throw new Error('Email or password is incorrect.');
  }

  const testHash = await hashPassword(password, found.salt);
  if (testHash !== found.passwordHash) {
    throw new Error('Email or password is incorrect.');
  }

  // 7-day session duration
  const session: Session = {
    token: `ses_${generateRandomHex(24)}`,
    userId: found.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  return { user: found, session };
}

/**
 * Retrieve current active session and validate expiration
 */
export function getCurrentSession(): { user: User; session: Session } | null {
  try {
    const rawSession = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!rawSession) return null;

    const session: Session = JSON.parse(rawSession);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }

    const users = getAllUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }

    return { user, session };
  } catch {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    return null;
  }
}

/**
 * Terminate active session
 */
export function terminateSession(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

/**
 * Mark email as verified
 */
export function confirmEmailVerification(userId: string): User {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('User not found.');
  }

  users[index].emailVerified = true;
  users[index].verificationToken = undefined;
  saveUsers(users);

  return users[index];
}

/**
 * Issue password reset token (1 hour validity)
 */
export function requestPasswordReset(email: string): { resetToken?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    // Return cleanly without revealing whether the email exists
    return {};
  }

  const resetToken = generateRandomHex(24);
  users[index].resetToken = resetToken;
  users[index].resetTokenExpires = Date.now() + 60 * 60 * 1000;
  saveUsers(users);

  return { resetToken };
}

/**
 * Verify token and reset password
 */
export async function executePasswordReset(
  token: string,
  newPassword: string
): Promise<void> {
  const users = getAllUsers();
  const index = users.findIndex(
    (u) => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > Date.now()
  );

  if (index === -1) {
    throw new Error('This reset link has expired. Request a new one.');
  }

  const salt = generateRandomHex(16);
  const passwordHash = await hashPassword(newPassword, salt);

  users[index].salt = salt;
  users[index].passwordHash = passwordHash;
  users[index].resetToken = undefined;
  users[index].resetTokenExpires = undefined;
  saveUsers(users);
}

/**
 * Change password for authenticated user
 */
export async function changeUserPassword(
  userId: string,
  oldPass: string,
  newPass: string
): Promise<void> {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('User not found.');

  const checkHash = await hashPassword(oldPass, users[index].salt);
  if (checkHash !== users[index].passwordHash) {
    throw new Error('Current password is incorrect.');
  }

  const salt = generateRandomHex(16);
  const passwordHash = await hashPassword(newPass, salt);
  users[index].salt = salt;
  users[index].passwordHash = passwordHash;
  saveUsers(users);
}

/**
 * Delete account and all associated user-scoped data
 */
export function removeUserAccount(userId: string): void {
  // Remove user from users list
  const users = getAllUsers().filter((u) => u.id !== userId);
  saveUsers(users);

  // Clear active session if it matches
  const current = getCurrentSession();
  if (current?.session.userId === userId) {
    terminateSession();
  }

  // Remove user-scoped data
  localStorage.removeItem(`subsentry:user:${userId}:transactions`);
  localStorage.removeItem(`subsentry:user:${userId}:recurring`);
  localStorage.removeItem(`subsentry:user:${userId}:candidates`);
  localStorage.removeItem(`subsentry:user:${userId}:settings`);
}
