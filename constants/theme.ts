export const Colors = {
  // Primary Colors - Bumble-inspired
  primary: '#FFD700', // Bumble yellow
  primaryDark: '#FFC700',
  primaryLight: '#FFE44D',
  
  // Tinder Gradient (Coral/Pink)
  purple: '#FF6B6B', // Tinder coral/pink
  purpleDark: '#FE3C72', // Tinder hot pink
  purpleLight: '#FF7854', // Tinder salmon
  
  // Background Colors
  background: '#FFFFFF',
  backgroundGray: '#F8F9FA',
  backgroundDark: '#1A1A1A',
  
  // Text Colors
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
  
  // UI Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Gradient Colors (Tinder)
  gradientStart: '#FE3C72', // Hot pink
  gradientEnd: '#FF7854', // Salmon
  
  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  screenPadding: Spacing.md,
  cardPadding: Spacing.md,
  headerHeight: 60,
  tabBarHeight: 60,
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
  Shadows,
  Layout,
};
