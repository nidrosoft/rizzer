/**
 * Appearance Settings Page
 * Manage app theme and display preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import ToggleItem from '@/components/settings/ToggleItem';
import { 
  Moon,
  Sun1,
  Mobile,
  TickCircle,
} from 'iconsax-react-native';
import { Colors, Spacing, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

type ThemeMode = 'light' | 'dark' | 'auto';

export default function AppearanceSettings() {
  const router = useRouter();
  
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setThemeMode(mode);
    // TODO: Implement theme switching
  };

  const themes = [
    { 
      id: 'light' as ThemeMode, 
      label: 'Light', 
      icon: Sun1,
      description: 'Bright and clean interface'
    },
    { 
      id: 'dark' as ThemeMode, 
      label: 'Dark', 
      icon: Moon,
      description: 'Easy on the eyes at night'
    },
    { 
      id: 'auto' as ThemeMode, 
      label: 'Auto', 
      icon: Mobile,
      description: 'Matches system settings'
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Theme Selection */}
        <SettingSection title="Theme">
          <View style={styles.themesContainer}>
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = themeMode === theme.id;
              
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    isSelected && styles.themeCardSelected,
                  ]}
                  onPress={() => handleThemeSelect(theme.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.themeIconContainer,
                    isSelected && styles.themeIconContainerSelected,
                  ]}>
                    <Icon 
                      size={28} 
                      color={isSelected ? Colors.purple : Colors.text} 
                      variant={isSelected ? 'Bold' : 'Outline'}
                    />
                  </View>
                  <Text style={[
                    styles.themeLabel,
                    isSelected && styles.themeLabelSelected,
                  ]}>
                    {theme.label}
                  </Text>
                  <Text style={styles.themeDescription}>
                    {theme.description}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <TickCircle size={24} color={Colors.purple} variant="Bold" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SettingSection>

        {/* Display Options */}
        <SettingSection title="Display Options">
          <ToggleItem
            icon={<Mobile size={22} color={Colors.text} variant="Outline" />}
            label="Reduced Motion"
            description="Minimize animations and transitions"
            value={reducedMotion}
            onValueChange={setReducedMotion}
          />
          <ToggleItem
            icon={<Mobile size={22} color={Colors.text} variant="Outline" />}
            label="Compact Mode"
            description="Show more content on screen"
            value={compactMode}
            onValueChange={setCompactMode}
            showDivider={false}
          />
        </SettingSection>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Theme changes will be applied immediately. Dark mode can help reduce eye strain in low-light conditions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  themesContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  themeCard: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  themeCardSelected: {
    borderColor: Colors.purple,
    backgroundColor: `${Colors.purple}10`,
  },
  themeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  themeIconContainerSelected: {
    backgroundColor: `${Colors.purple}20`,
  },
  themeLabel: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  themeLabelSelected: {
    color: Colors.purple,
  },
  themeDescription: {
    fontSize: normalize(13),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoText: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
});
