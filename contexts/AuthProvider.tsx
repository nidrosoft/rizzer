/**
 * Auth Provider
 * Initializes auth state without interfering with existing navigation flow
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useAppStore } from '@/store/appStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore(state => state.initialize);
  const loadUserData = useUserStore(state => state.loadFromStorage);
  const loadAppData = useAppStore(state => state.loadFromStorage);

  // Initialize stores on mount (no navigation interference)
  useEffect(() => {
    const init = async () => {
      // Load all stores silently in background
      await Promise.all([
        initialize(),
        loadUserData(),
        loadAppData(),
      ]);
    };

    init();
  }, []);

  // No navigation logic - let the existing flow handle it
  return <>{children}</>;
}
