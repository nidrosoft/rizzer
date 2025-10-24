/**
 * Standard Header Configuration
 * 
 * IMPORTANT: These values are the STANDARD for ALL screens in the app.
 * They match the Rizz page design and should be used consistently everywhere.
 * 
 * DO NOT modify these values without updating ALL screens.
 */

import { Spacing } from './theme';

export const HeaderConfig = {
  /**
   * Standard spacing from SafeAreaView top to header content
   * Matches Rizz page: navigation.paddingTop
   */
  paddingTop: Spacing.md, // 16px

  /**
   * Standard horizontal padding for header
   * Matches Rizz page: navigation.paddingHorizontal
   */
  paddingHorizontal: Spacing.lg, // 24px

  /**
   * Standard size for icon buttons (back, close, menu)
   * Matches Rizz page: navButton size
   */
  iconButtonSize: 44, // 44px × 44px

  /**
   * Standard border radius for icon buttons
   * Matches Rizz page: navButton.borderRadius
   */
  iconButtonRadius: 22, // 22px (half of 44px)

  /**
   * Standard shadow for icon buttons
   */
  iconButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

/**
 * Usage Example:
 * 
 * import { HeaderConfig } from '@/constants/header';
 * 
 * const styles = StyleSheet.create({
 *   header: {
 *     paddingTop: HeaderConfig.paddingTop,
 *     paddingHorizontal: HeaderConfig.paddingHorizontal,
 *   },
 *   iconButton: {
 *     width: HeaderConfig.iconButtonSize,
 *     height: HeaderConfig.iconButtonSize,
 *     borderRadius: HeaderConfig.iconButtonRadius,
 *     ...HeaderConfig.iconButtonShadow,
 *   },
 * });
 */
