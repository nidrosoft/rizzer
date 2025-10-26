/**
 * Category Header Component
 * Gradient header with navigation and description
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface CategoryHeaderProps {
  title: string;
  description: string;
  onBack: () => void;
  onMoreOptions: () => void;
}

export default function CategoryHeader({
  title,
  description,
  onBack,
  onMoreOptions,
}: CategoryHeaderProps) {
  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onBack();
  };

  const handleMore = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMoreOptions();
  };

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleBack}
          activeOpacity={0.6}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
            <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
          </Svg>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleMore}
          activeOpacity={0.6}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0_4418_7499)">
              <Path d="M5 14.75C3.48 14.75 2.25 13.52 2.25 12C2.25 10.48 3.48 9.25 5 9.25C6.52 9.25 7.75 10.48 7.75 12C7.75 13.52 6.52 14.75 5 14.75ZM5 10.75C4.31 10.75 3.75 11.31 3.75 12C3.75 12.69 4.31 13.25 5 13.25C5.69 13.25 6.25 12.69 6.25 12C6.25 11.31 5.69 10.75 5 10.75Z" fill={Colors.text}/>
              <Path d="M19 14.75C17.48 14.75 16.25 13.52 16.25 12C16.25 10.48 17.48 9.25 19 9.25C20.52 9.25 21.75 10.48 21.75 12C21.75 13.52 20.52 14.75 19 14.75ZM19 10.75C18.31 10.75 17.75 11.31 17.75 12C17.75 12.69 18.31 13.25 19 13.25C19.69 13.25 20.25 12.69 20.25 12C20.25 11.31 19.69 10.75 19 10.75Z" fill={Colors.text}/>
              <Path d="M12 14.75C10.48 14.75 9.25 13.52 9.25 12C9.25 10.48 10.48 9.25 12 9.25C13.52 9.25 14.75 10.48 14.75 12C14.75 13.52 13.52 14.75 12 14.75ZM12 10.75C11.31 10.75 10.75 11.31 10.75 12C10.75 12.69 11.31 13.25 12 13.25C12.69 13.25 13.25 12.69 13.25 12C13.25 11.31 12.69 10.75 12 10.75Z" fill={Colors.text}/>
            </G>
            <Defs>
              <ClipPath id="clip0_4418_7499">
                <Rect width="24" height="24" fill="white"/>
              </ClipPath>
            </Defs>
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  title: {
    fontSize: normalize(24),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: normalize(15),
    color: Colors.textWhite,
    textAlign: 'center',
    lineHeight: normalize(20),
    opacity: 0.9,
  },
});
