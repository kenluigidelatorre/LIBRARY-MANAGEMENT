import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'cmd_library_auth_user';

function formatUser(apiUser, token) {
  const roleLabels = {
    ADMIN: 'Head Librarian',
    LIBRARY_STAFF: 'Library Staff',
  };

  return {
    id: apiUser.id,
    name: apiUser.fullName,
    email: apiUser.email,
    role: roleLabels[apiUser.role] || apiUser.role,
    roleCode: apiUser.role,
    token,
  };
}

function getStoredSession() {
  try {
    const saved =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (
      !parsed?.token ||
      parsed.token === 'demo-session-token' ||
      parsed.token.startsWith('session-')
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function saveSession(user, rememberMe) {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore and verify an existing session.
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const storedUser = getStoredSession();

      if (!storedUser?.token) {
        if (active) setAuthLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');

        const authenticatedUser = formatUser(
          response.data.user,
          storedUser.token
        );

        if (active) {
          setUser(authenticatedUser);
        }

        saveSession(
          authenticatedUser,
          Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
        );
      } catch {
        clearSession();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Authenticate using the real backend.
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
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, user: apiUser } = response.data;

      if (!token || !apiUser) {
        return {
          ok: false,
          error: 'Invalid authentication response from server.',
        };
      }

      const authenticatedUser = formatUser(apiUser, token);

      saveSession(authenticatedUser, rememberMe);
      setUser(authenticatedUser);

      return {
        ok: true,
        user: authenticatedUser,
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error.message === 'Network Error'
            ? 'Unable to connect to the server. Please try again.'
            : error.message,
      };
    }
  };

  // Registration is disabled until a secure backend endpoint exists.
  const register = async () => ({
    ok: false,
    error:
      'Account registration is currently unavailable. Please contact your library administrator.',
  });

  const logout = () => {
    clearSession();
    setUser(null);
  };

  // Only allow local display-name updates.
  // Email and role must come from the authenticated backend account.
  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: updates.name?.trim() || user.name,
    };

    setUser(updatedUser);

    const storage = localStorage.getItem(AUTH_STORAGE_KEY)
      ? localStorage
      : sessionStorage;

    storage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        authLoading,
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