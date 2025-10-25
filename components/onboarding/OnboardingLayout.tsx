import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { ArrowRight, CloseCircle, DocumentText, Trash } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  icon: any;
  title: string;
  helperText?: string;
  children: ReactNode;
  onContinue: () => void;
  canContinue: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  onCancel?: () => void;
  onSaveAsDraft?: () => void;
}

export default function OnboardingLayout(props: OnboardingLayoutProps) {
  const {
    currentStep,
    totalSteps,
    icon,
    title,
    helperText,
    children,
    onContinue,
    canContinue,
    showSkip = false,
    onSkip,
    onCancel,
    onSaveAsDraft,
  } = props;

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClosePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowCancelModal(true);
  };

  const handleSaveAsDraft = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowCancelModal(false);
    onSaveAsDraft?.();
  };

  const handleDiscard = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowCancelModal(false);
    onCancel?.();
  };

  const IconComponent = icon;
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      {showSkip && onSkip && (
        <View style={styles.header}>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepper}>
          <View style={styles.iconCircle}>
            {IconComponent && (
              <IconComponent size={20} color={Colors.text} variant="Outline" />
            )}
          </View>
          {[...Array(totalSteps)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index < currentStep - 1 && styles.stepDotFilled,
                index === currentStep - 1 && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Helper Text - Moved under title */}
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}

        {/* Children (inputs, options, etc) */}
        {children}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={onContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <ArrowRight
            size={28}
            color={canContinue ? Colors.background : Colors.border}
            variant="Outline"
          />
        </TouchableOpacity>
      </View>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Profile Creation?</Text>
            <Text style={styles.modalMessage}>
              You can save your progress as a draft or discard all changes.
            </Text>

            {/* Save as Draft Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAsDraft}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(171, 71, 188, 0.15)' }]}>
                  <DocumentText size={22} color={Colors.purple} variant="Bold" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Save as Draft</Text>
                  <Text style={styles.optionSubtext}>Continue later</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Discard Button */}
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscard}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 87, 87, 0.15)' }]}>
                  <Trash size={22} color="#FF5757" variant="Bold" />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: '#FF5757' }]}>Discard Changes</Text>
                  <Text style={styles.optionSubtext}>Delete all progress</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCancelModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Continue Editing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    minHeight: 44,
  },
  spacer: {
    flex: 1,
  },
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  skipText: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
  stepperContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  stepDotFilled: {
    backgroundColor: Colors.text,
  },
  stepDotActive: {
    backgroundColor: Colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  helperText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  bottomButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'flex-end',
  },
  continueButton: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: normalize(22),
  },
  saveButton: {
    marginBottom: Spacing.md,
  },
  discardButton: {
    marginBottom: Spacing.lg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  modalCancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
});

OnboardingLayout.displayName = 'OnboardingLayout';

