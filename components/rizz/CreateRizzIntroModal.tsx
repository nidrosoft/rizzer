/**
 * CreateRizzIntroModal Component
 * Awareness bottom sheet before creating custom Rizz category
 * Matches Gift creation flow style
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { CloseSquare } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface CreateRizzIntroModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function CreateRizzIntroModal({ visible, onClose, onContinue }: CreateRizzIntroModalProps) {
  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onContinue();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
            <CloseSquare size={28} color={Colors.textSecondary} variant="Outline" />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Create Custom Rizz</Text>
            <Text style={styles.description}>
              Build your personalized Rizz category! Choose a name, description, emoji, and color that represents your unique style.
            </Text>

            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📝</Text>
                <Text style={styles.featureText}>Custom category name & description</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>😊</Text>
                <Text style={styles.featureText}>Pick your favorite emoji</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎨</Text>
                <Text style={styles.featureText}>Choose a unique color theme</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🤖</Text>
                <Text style={styles.featureText}>AI generates custom rizz lines</Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.continueGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueText}>Let's Do It!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  content: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    gap: Spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  buttons: {
    gap: Spacing.md,
  },
  continueButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    height: 56,
  },
  continueGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
