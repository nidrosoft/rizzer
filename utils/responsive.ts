/**
 * Responsive Design Utilities
 * Provides scaling functions for fonts, spacing, and components
 * to ensure consistent UI across all device sizes
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X/11/12/13 - most common)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Calculate scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
const scale = Math.min(widthScale, heightScale);

/**
 * Normalize font sizes and component dimensions
 * Scales proportionally based on device size
 * 
 * @param size - Base size (from design)
 * @returns Scaled size for current device
 */
export const normalize = (size: number): number => {
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  // Android typically needs slightly smaller sizes
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Scale vertically (height-based)
 * Use for vertical spacing, margins, paddings
 * 
 * @param size - Base size
 * @returns Vertically scaled size
 */
export const verticalScale = (size: number): number => {
  return Math.round((SCREEN_HEIGHT / BASE_HEIGHT) * size);
};

/**
 * Scale horizontally (width-based)
 * Use for horizontal spacing, widths
 * 
 * @param size - Base size
 * @returns Horizontally scaled size
 */
export const horizontalScale = (size: number): number => {
  return Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);
};

/**
 * Moderate scale (balanced)
 * Use when you want some scaling but not full proportional
 * Good for buttons, cards, etc.
 * 
 * @param size - Base size
 * @param factor - Scaling factor (0-1, default 0.5)
 * @returns Moderately scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (normalize(size) - size) * factor);
};

/**
 * Device type detection
 */
export const isSmallDevice = SCREEN_WIDTH < 375; // iPhone SE, small Android
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414; // iPhone X/11/12/13
export const isLargeDevice = SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768; // iPhone Pro Max
export const isTablet = SCREEN_WIDTH >= 768; // iPad, Android tablets

/**
 * Get responsive value based on device size
 * 
 * @param small - Value for small devices
 * @param medium - Value for medium devices
 * @param large - Value for large devices
 * @param tablet - Value for tablets
 * @returns Appropriate value for current device
 */
export const getResponsiveValue = <T,>(
  small: T,
  medium: T,
  large?: T,
  tablet?: T
): T => {
  if (isTablet && tablet !== undefined) return tablet;
  if (isLargeDevice && large !== undefined) return large;
  if (isMediumDevice) return medium;
  return small;
};

/**
 * Screen dimensions
 */
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

/**
 * Common responsive sizes
 * Use these for consistency across the app
 */
export const ResponsiveSizes = {
  // Font sizes
  fontXS: normalize(10),
  fontSM: normalize(12),
  fontMD: normalize(14),
  fontLG: normalize(16),
  fontXL: normalize(18),
  font2XL: normalize(20),
  font3XL: normalize(24),
  font4XL: normalize(32),
  font5XL: normalize(48),
  
  // Spacing
  spaceXS: normalize(4),
  spaceSM: normalize(8),
  spaceMD: normalize(12),
  spaceLG: normalize(16),
  spaceXL: normalize(24),
  space2XL: normalize(32),
  space3XL: normalize(48),
  
  // Component sizes
  buttonHeight: normalize(56),
  inputHeight: normalize(48),
  iconSM: normalize(20),
  iconMD: normalize(24),
  iconLG: normalize(28),
  iconXL: normalize(32),
  
  // Border radius
  radiusSM: normalize(8),
  radiusMD: normalize(12),
  radiusLG: normalize(16),
  radiusXL: normalize(24),
  radiusFull: normalize(999),
};

/**
 * Helper to get percentage-based dimensions
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Safe area helpers
 * Use with useSafeAreaInsets() hook
 */
export const getSafeAreaPadding = (
  insets: { top: number; bottom: number; left: number; right: number },
  additionalPadding: number = 0
) => ({
  paddingTop: insets.top + additionalPadding,
  paddingBottom: insets.bottom + additionalPadding,
  paddingLeft: insets.left + additionalPadding,
  paddingRight: insets.right + additionalPadding,
});
