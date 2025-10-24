/**
 * Safe LinearGradient Wrapper
 * Now using real LinearGradient with error boundary fallback
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

interface SafeLinearGradientProps {
  colors: string[];
  style?: ViewStyle | ViewStyle[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children?: React.ReactNode;
}

export function SafeLinearGradient({ 
  colors, 
  style, 
  start, 
  end, 
  children 
}: SafeLinearGradientProps) {
  try {
    // Try to use real LinearGradient
    return (
      <ExpoLinearGradient
        colors={colors as any}
        style={style}
        start={start}
        end={end}
      >
        {children}
      </ExpoLinearGradient>
    );
  } catch (error) {
    // Fallback to solid color if it fails
    console.warn('LinearGradient failed, using fallback:', error);
    const fallbackColor = colors[0] || '#FE3C72';
    
    return (
      <View style={[style, { backgroundColor: fallbackColor }]}>
        {children}
      </View>
    );
  }
}

// Also export as default for easier replacement
export default SafeLinearGradient;
