/**
 * StepLayout Component for Gifts feature
 * Shared layout for multi-step investigation flow
 */

import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { HeaderConfig } from '@/constants/header';

interface StepLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  children: React.ReactNode;
  onBack?: () => void;
}

const STEP_LABELS = ['Contact', 'Occasion', 'Details', 'Suggestions', 'Review'];

export default function StepLayout({ 
  title, 
  currentStep, 
  totalSteps,
  stepTitle,
  children,
  onBack,
}: StepLayoutProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <View style={styles.backCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
                <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
              </Svg>
            </View>
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep + 1} of {totalSteps}</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <View style={styles.closeCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <G clipPath="url(#clip0_4418_7386)">
                  <Path d="M9.17011 15.5794C8.98011 15.5794 8.79011 15.5094 8.64011 15.3594C8.35011 15.0694 8.35011 14.5894 8.64011 14.2994L14.3001 8.63938C14.5901 8.34938 15.0701 8.34938 15.3601 8.63938C15.6501 8.92937 15.6501 9.40937 15.3601 9.69937L9.70011 15.3594C9.56011 15.5094 9.36011 15.5794 9.17011 15.5794Z" fill={Colors.text}/>
                  <Path d="M14.8301 15.5794C14.6401 15.5794 14.4501 15.5094 14.3001 15.3594L8.64011 9.69937C8.35011 9.40937 8.35011 8.92937 8.64011 8.63938C8.93011 8.34938 9.41011 8.34938 9.70011 8.63938L15.3601 14.2994C15.6501 14.5894 15.6501 15.0694 15.3601 15.3594C15.2101 15.5094 15.0201 15.5794 14.8301 15.5794Z" fill={Colors.text}/>
                  <Path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill={Colors.text}/>
                </G>
                <Defs>
                  <ClipPath id="clip0_4418_7386">
                    <Rect width="24" height="24" fill="white"/>
                  </ClipPath>
                </Defs>
              </Svg>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </SafeAreaView>

      {/* Step Title */}
      <View style={styles.stepTitleContainer}>
        <Text style={styles.stepTitle}>{stepTitle}</Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HeaderConfig.paddingHorizontal,
    paddingTop: HeaderConfig.paddingTop,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: HeaderConfig.iconButtonSize,
    height: HeaderConfig.iconButtonSize,
  },
  backCircle: {
    width: HeaderConfig.iconButtonSize,
    height: HeaderConfig.iconButtonSize,
    borderRadius: HeaderConfig.iconButtonRadius,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: HeaderConfig.iconButtonSize,
    height: HeaderConfig.iconButtonSize,
  },
  closeCircle: {
    width: HeaderConfig.iconButtonSize,
    height: HeaderConfig.iconButtonSize,
    borderRadius: HeaderConfig.iconButtonRadius,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: HeaderConfig.paddingHorizontal,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepTitleContainer: {
    paddingHorizontal: HeaderConfig.paddingHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  stepTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  keyboardView: {
    flex: 1,
  },
});
