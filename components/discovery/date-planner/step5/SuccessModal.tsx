/**
 * Success Modal Component
 * Modal shown when date plan is completed
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { TickCircle } from 'iconsax-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface SuccessModalProps {
  visible: boolean;
}

export default function SuccessModal({ visible }: SuccessModalProps) {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (visible && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={3000}
        />
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.icon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TickCircle size={48} color={Colors.textWhite} variant="Bold" />
            </LinearGradient>
            <Text style={styles.title}>Date Plan Saved!</Text>
            <Text style={styles.message}>
              Your perfect date is ready to go. Have an amazing time! 💕
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: normalize(22),
  },
});
