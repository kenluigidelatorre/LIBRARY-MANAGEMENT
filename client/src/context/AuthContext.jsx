import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'cmd_library_auth_user';

function readStoredUser() {
  try {
    const saved =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!saved || saved === 'null') return null;

    const parsed = JSON.parse(saved);

    if (!parsed?.token) return null;

    return parsed;
  } catch {
    return null;
  }
}

function clearStoredUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function saveStoredUser(user, rememberMe) {
  clearStoredUser();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function mapBackendUser(user, token) {
  const roleCode = String(user.role || '').toUpperCase();

  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    role: roleCode === 'ADMIN'
      ? 'Head Librarian'
      : 'Library Staff',
    roleCode,
    token,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const [authLoading, setAuthLoading] = useState(
    () => Boolean(readStoredUser()?.token)
  );

  // Verify previously stored JWT with the backend.
  useEffect(() => {
    if (!user?.token) {
      setAuthLoading(false);
      return;
    }

    let active = true;

    const rememberMe = Boolean(
      localStorage.getItem(AUTH_STORAGE_KEY)
    );

    api.get('/auth/me')
      .then(({ data }) => {
        if (!active) return;

        const verifiedUser = mapBackendUser(
          data.user,
          user.token
        );

        setUser(verifiedUser);
        saveStoredUser(verifiedUser, rememberMe);
      })
      .catch(() => {
        if (!active) return;

        clearStoredUser();
        setUser(null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Authenticate using the actual backend login endpoint.
  const login = async ({
    email,
    password,
    rememberMe = true,
  }) => {
    if (!email?.trim() || !password) {
      return {
        ok: false,
        error: 'Please enter both email address and password.',
      };
    }

    try {
      const { data } = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (!data.success || !data.token || !data.user) {
        return {
          ok: false,
          error: 'Invalid login response from server.',
        };
      }

      const authenticatedUser = mapBackendUser(
        data.user,
        data.token
      );

      saveStoredUser(authenticatedUser, rememberMe);
      setUser(authenticatedUser);

      return {
        ok: true,
        user: authenticatedUser,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message || 'Unable to sign in.',
      };
    }
  };

  // Self-registration is unavailable because the backend
  // currently has no public registration endpoint.
  const register = async () => ({
    ok: false,
    error: 'Self-registration is currently unavailable. Please contact your system administrator.',
  });

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updated = { ...user, ...updates };

    setUser(updated);

    const rememberMe = Boolean(
      localStorage.getItem(AUTH_STORAGE_KEY)
    );

    saveStoredUser(updated, rememberMe);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: Boolean(user?.token),
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