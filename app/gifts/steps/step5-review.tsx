/**
 * Step 5: Final Review
 * Review all details before sending Sherlock
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Modal, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Send2, User, Calendar, Heart, MessageText, TickCircle, ShoppingCart, Lamp } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import StepLayout from '@/components/gifts/StepLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import ContinueButton from '@/components/gifts/ContinueButton';

export default function Step5PurchaseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { 
    contactName, 
    occasion, 
    relationshipContext, 
    occasionDate,
    selectedGiftId,
    selectedGiftTitle,
    selectedGiftPrice,
  } = params;

  // Find occasion details
  const occasionDetails = GiftsConfig.occasions.find(o => o.id === occasion);

  const handleStartInvestigation = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Navigate to gifts tab after delay
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push('/tabs/gifts');
    }, 2500);
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <StepLayout
      title="New Investigation"
      currentStep={4}
      totalSteps={5}
      stepTitle="Final Review"
      onBack={handleBack}
    >
      <View style={styles.container}>
        {/* Review Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <SectionHeader
              title="Investigation Summary"
              subtitle="Review everything before sending Sherlock"
            />

            {/* Review Cards */}
            <View style={styles.reviewCard}>
              <View style={[styles.reviewIconContainer, { backgroundColor: '#FF6B6B20' }]}>
                <User size={20} color="#FF6B6B" variant="Bold" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Recipient</Text>
                <Text style={styles.reviewValue}>{contactName}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={[styles.reviewIconContainer, { backgroundColor: '#4ECDC420' }]}>
                <Heart size={20} color="#4ECDC4" variant="Bold" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Occasion</Text>
                <Text style={styles.reviewValue}>
                  {occasionDetails?.icon} {occasionDetails?.label}
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={[styles.reviewIconContainer, { backgroundColor: '#A78BFA20' }]}>
                <MessageText size={20} color="#A78BFA" variant="Bold" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Relationship</Text>
                <Text style={styles.reviewValue}>{relationshipContext}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={[styles.reviewIconContainer, { backgroundColor: '#FCA5A520' }]}>
                <Calendar size={20} color="#FCA5A5" variant="Bold" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Date</Text>
                <Text style={styles.reviewValue}>{formatDate(occasionDate as string)}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={[styles.reviewIconContainer, { backgroundColor: '#10B98120' }]}>
                <Send2 size={20} color="#10B981" variant="Bold" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Platform</Text>
                <Text style={styles.reviewValue}>{params.platform === 'whatsapp' ? 'WhatsApp' : 'Messages'}</Text>
              </View>
            </View>

            {/* Message Preview Section */}
            <View style={styles.sectionDivider} />
            <SectionHeader
              title="Message Preview"
              subtitle="What Sherlock will send"
            />
            <View style={styles.messagePreviewContainer}>
              <View style={styles.messagePreviewCard}>
                <Text style={styles.messagePreviewText}>{params.messagePreview || 'Message preview not available'}</Text>
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoIconContainer}>
                <Lamp size={20} color={Colors.gradientStart} variant="Bold" />
              </View>
              <Text style={styles.infoText}>
                Sherlock will reach out to {contactName} via {params.platform === 'whatsapp' ? 'WhatsApp' : 'Messages'} anonymously. You'll be able to monitor the conversation in real-time and inject messages if needed.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Send Sherlock Button */}
        <ContinueButton
          onPress={handleStartInvestigation}
          label="Send Sherlock"
        />

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModal}>
              <View style={styles.successIconContainer}>
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.successIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <TickCircle size={48} color={Colors.textWhite} variant="Bold" />
                </LinearGradient>
              </View>
              <Text style={styles.successTitle}>Investigation Started!</Text>
              <Text style={styles.successMessage}>
                Sherlock is now reaching out to {contactName}. You'll be notified when the conversation begins.
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  reviewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  reviewContent: {
    flex: 1,
  },
  reviewLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: FontWeights.semibold,
  },
  reviewValue: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${Colors.gradientStart}08`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.gradientStart}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  messagePreviewContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  messagePreviewCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  messagePreviewText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  button: {
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 4,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xl,
  },
  giftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.gradientStart,
  },
  giftIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  giftContent: {
    flex: 1,
  },
  giftTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs - 2,
  },
  giftPrice: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: GiftsConfig.gradient.start,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xxl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  successIconContainer: {
    marginBottom: Spacing.xl,
  },
  successIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
