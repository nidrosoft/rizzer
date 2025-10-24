import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    textStyle,
  ];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[buttonStyles, { overflow: 'hidden' }]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <>
              {icon && <>{icon}</>}
              <Text style={textStyles}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[buttonStyles, styles[`${variant}Button`]]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.purple : Colors.textWhite} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Size variants
  smallButton: {
    height: 36,
    paddingHorizontal: Spacing.md,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: Spacing.lg,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: Spacing.xl,
  },
  
  // Button variants
  primaryButton: {
    ...Shadows.medium,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundGray,
  },
  outlineButton: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.purple,
  },
  ghostButton: {
    backgroundColor: Colors.transparent,
  },
  
  // Text styles
  text: {
    fontWeight: FontWeights.semibold,
  },
  smallText: {
    fontSize: FontSizes.sm,
  },
  mediumText: {
    fontSize: FontSizes.md,
  },
  largeText: {
    fontSize: FontSizes.lg,
  },
  primaryText: {
    color: Colors.textWhite,
  },
  secondaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.purple,
  },
  ghostText: {
    color: Colors.purple,
  },
});
