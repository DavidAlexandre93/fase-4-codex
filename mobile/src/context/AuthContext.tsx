import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getAuthenticatedUser, loginRequest } from '@/api/auth';
import type { AuthUser, Role } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  hasRole: () => false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as Omit<AuthUser, 'token'>;

        try {
          const refreshedUser = await getAuthenticatedUser();
          setUser({ ...refreshedUser, token: storedToken });
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({ id: refreshedUser.id, name: refreshedUser.name, role: refreshedUser.role })
          );
        } catch {
          setUser({ ...parsedUser, token: storedToken });
        }
      }
      setIsLoading(false);
    }

    loadStoredSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await loginRequest(email, password);

    await AsyncStorage.setItem('token', authUser.token);
    await AsyncStorage.setItem(
      'user',
      JSON.stringify({ id: authUser.id, name: authUser.name, role: authUser.role })
    );
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, logout, hasRole }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
