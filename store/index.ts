/**
 * Store Index
 * Central export for all Zustand stores
 */

export { useAuthStore, selectUser, selectIsAuthenticated, selectIsLoading, selectIsInitialized } from './authStore';
export { useUserStore, selectFavorites, selectRSVPs, selectDateProfiles, selectInterests } from './userStore';
export { useAppStore, selectIsOnboarded, selectTheme, selectNotifications, selectLocation } from './appStore';

// Re-export types
export type { User } from './authStore';
export type { DateProfile } from './userStore';
