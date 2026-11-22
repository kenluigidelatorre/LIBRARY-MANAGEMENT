
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'cmd_library_auth_user';
const REGISTERED_USERS_KEY = 'cmd_library_registered_users';

const DEFAULT_ADMIN = {
  id: 'ADM-001',
  name: 'Admin User',
  email: 'admin@cmdlibrary.edu',
  role: 'Head Librarian',
  roleCode: 'ADMIN',
  token: 'demo-session-token',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === 'null') return null;
      if (stored) return JSON.parse(stored);

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const login = ({ email, password, rememberMe = true }) => {
    if (!email || !password) {
      return { ok: false, error: 'Please enter both email address and password.' };
    }

    if (password.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters.' };
    }

    let registered = [];

    try {
      registered = JSON.parse(
        localStorage.getItem(REGISTERED_USERS_KEY) || '[]'
      );
    } catch {
      registered = [];
    }

    const normalizedEmail = email.trim().toLowerCase();

    const matched = registered.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (matched && matched.password !== password) {
      return { ok: false, error: 'Incorrect password for this account.' };
    }

    const isAdmin =
      normalizedEmail === DEFAULT_ADMIN.email.toLowerCase() ||
      matched?.roleCode === 'ADMIN';

    const sessionUser = matched
      ? {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role || 'Librarian',
          roleCode: matched.roleCode || 'STAFF',
          token: 'session-' + Date.now(),
        }
      : {
          id: DEFAULT_ADMIN.id,
          name: email.includes('admin')
            ? DEFAULT_ADMIN.name
            : email.split('@')[0],
          email: email.trim(),
          role: isAdmin ? 'Head Librarian' : 'Library Staff',
          roleCode: isAdmin ? 'ADMIN' : 'STAFF',
          token: 'session-' + Date.now(),
        };

    setUser(sessionUser);

    if (rememberMe) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(sessionUser)
      );
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return { ok: true, user: sessionUser };
  };

  const register = ({ name, email, password }) => {
    if (!name || !email || !password) {
      return { ok: false, error: 'All fields are required.' };
    }

    let registered = [];

    try {
      registered = JSON.parse(
        localStorage.getItem(REGISTERED_USERS_KEY) || '[]'
      );
    } catch {
      registered = [];
    }

    if (
      registered.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      return {
        ok: false,
        error: 'An account with this email already exists.',
      };
    }

    const newUser = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'Library Staff',
      roleCode: 'STAFF',
    };

    localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify([...registered, newUser])
    );

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      roleCode: newUser.roleCode,
      token: 'session-' + Date.now(),
    };

    setUser(sessionUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(sessionUser)
    );

    return { ok: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem(AUTH_STORAGE_KEY, 'null');
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updated = { ...user, ...updates };
    setUser(updated);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
