/**
 * Step 4: Platform & Message Preview
 * Choose platform and preview Sherlock's message
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform as RNPlatform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { RefreshCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { Platform, CreativityMode } from '@/types/gifts';
import StepLayout from '@/components/gifts/StepLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import ContinueButton from '@/components/gifts/ContinueButton';

export default function Step4PlatformScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [platform, setPlatform] = useState<Platform>('whatsapp');
  const [creativityMode, setCreativityMode] = useState<CreativityMode>('creative');
  const [messagePreview, setMessagePreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { contactName, occasion, relationshipContext, extraInstructions, budget, language } = params;

  useEffect(() => {
    generateMessagePreview();
  }, [creativityMode]);

  const generateMessagePreview = () => {
    setIsGenerating(true);
    
    // Simulate AI message generation
    setTimeout(() => {
      const preview = creativityMode === 'standard' 
        ? generateStandardMessage()
        : generateCreativeMessage();
      
      setMessagePreview(preview);
      setIsGenerating(false);
    }, 1500);
  };

  const generateStandardMessage = () => {
    return `Hey ${contactName}! 👋\n\nOne of your friends wants to give you something special for your ${occasion}. To make sure it's something you'll love, I'd like to ask you a few quick questions about your interests and preferences.\n\nWould you mind sharing what you've been into lately? Any hobbies, products, or experiences you've been eyeing?\n\nThanks!\n- Sherlock 🎁`;
  };

  const generateCreativeMessage = () => {
    const contextStr = Array.isArray(relationshipContext) ? relationshipContext[0] : relationshipContext;
    const instructionsStr = Array.isArray(extraInstructions) ? extraInstructions[0] : extraInstructions;
    
    const contextHint = contextStr ? `from ${contextStr.split('from')[1]?.trim() || 'your circle'}` : '';
    const instructionHint = instructionsStr ? `\n\n${instructionsStr.split(',')[0]}` : '';
    
    return `Hey ${contactName}! 🎉\n\nSomeone special ${contextHint} is planning something amazing for your ${occasion}, and they want to make it absolutely perfect for you!\n\nI'm Sherlock, and I'm here to help discover what would make you smile. Mind if I ask you a few questions about what you're passionate about these days?${instructionHint}\n\nLooking forward to chatting!\n- Sherlock ✨`;
  };

  const handlePlatformSelect = (selectedPlatform: Platform) => {
    if (RNPlatform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPlatform(selectedPlatform);
  };

  const handleCreativityModeSelect = (mode: CreativityMode) => {
    if (RNPlatform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCreativityMode(mode);
  };

  const handleRegenerate = () => {
    if (RNPlatform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    generateMessagePreview();
  };

  const handleContinue = () => {
    // Navigate to Step 5 (Review) with all data
    router.push({
      pathname: '/gifts/steps/step5-review',
      params: {
        ...params,
        platform,
        creativityMode,
        messagePreview,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StepLayout
      title="New Investigation"
      currentStep={3}
      totalSteps={5}
      stepTitle="Platform & Preview"
      onBack={handleBack}
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Platform Selection */}
            <SectionHeader
              title="Choose Platform"
              subtitle="How should Sherlock reach out?"
            />
            <View style={styles.platformContainer}>
              <TouchableOpacity
                style={[
                  styles.platformCard,
                  platform === 'whatsapp' && styles.platformCardSelected,
                ]}
                onPress={() => handlePlatformSelect('whatsapp')}
                activeOpacity={0.7}
              >
                <View style={[styles.platformIcon, { backgroundColor: '#25D366' }]}>
                  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <Path d="M16 2C8.268 2 2 8.268 2 16C2 18.592 2.732 21.012 4.002 23.074L2.172 29.828L9.126 28.026C11.116 29.164 13.478 29.828 16 29.828C23.732 29.828 30 23.56 30 15.828C30 8.096 23.732 2 16 2ZM16 27.656C13.758 27.656 11.638 27.032 9.828 25.938L9.414 25.688L4.828 26.828L5.986 22.344L5.708 21.914C4.516 20.044 3.828 17.828 3.828 15.5C3.828 9.148 9.148 3.828 15.5 3.828C21.852 3.828 27.172 9.148 27.172 15.5C27.172 21.852 21.852 27.172 15.5 27.172V27.656Z" fill="white"/>
                  </Svg>
                </View>
                <Text style={[styles.platformLabel, platform === 'whatsapp' && styles.platformLabelSelected]}>
                  WhatsApp
                </Text>
                {platform === 'whatsapp' && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.platformCard,
                  platform === 'imessage' && styles.platformCardSelected,
                ]}
                onPress={() => handlePlatformSelect('imessage')}
                activeOpacity={0.7}
              >
                <View style={[styles.platformIcon, { backgroundColor: '#007AFF' }]}>
                  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <Path d="M16 4C9.372 4 4 8.486 4 14C4 16.874 5.484 19.438 7.828 21.172C7.828 21.172 7.5 24.5 7.5 24.5C7.5 24.5 11.328 22.328 11.328 22.328C12.828 22.766 14.386 23 16 23C22.628 23 28 18.514 28 13C28 7.486 22.628 3 16 3V4Z" fill="white"/>
                  </Svg>
                </View>
                <Text style={[styles.platformLabel, platform === 'imessage' && styles.platformLabelSelected]}>
                  Messages
                </Text>
                {platform === 'imessage' && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Creativity Mode */}
            <SectionHeader
              title="Message Style"
              subtitle="Choose how Sherlock introduces itself"
            />
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[
                  styles.modeCard,
                  creativityMode === 'standard' && styles.modeCardSelected,
                ]}
                onPress={() => handleCreativityModeSelect('standard')}
                activeOpacity={0.7}
              >
                <Text style={[styles.modeLabel, creativityMode === 'standard' && styles.modeLabelSelected]}>
                  Standard
                </Text>
                <Text style={styles.modeDescription}>
                  Professional and straightforward
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  creativityMode === 'creative' && styles.modeCardSelected,
                ]}
                onPress={() => handleCreativityModeSelect('creative')}
                activeOpacity={0.7}
              >
                <Text style={[styles.modeLabel, creativityMode === 'creative' && styles.modeLabelSelected]}>
                  Creative
                </Text>
                <Text style={styles.modeDescription}>
                  Friendly and personalized
                </Text>
              </TouchableOpacity>
            </View>

            {/* Message Preview */}
            <View style={styles.previewSection}>
              <View style={styles.previewHeader}>
                <View style={styles.previewHeaderLeft}>
                  <SectionHeader
                    title="Message Preview"
                    subtitle="This is what Sherlock will send"
                  />
                </View>
                <TouchableOpacity
                  style={styles.regenerateButton}
                  onPress={handleRegenerate}
                  disabled={isGenerating}
                  activeOpacity={0.7}
                >
                  <RefreshCircle 
                    size={20} 
                    color={isGenerating ? Colors.textSecondary : Colors.gradientStart} 
                    variant="Bold" 
                  />
                  <Text style={[styles.regenerateText, isGenerating && styles.regenerateTextDisabled]}>
                    Regenerate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.previewCard}>
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.gradientStart} />
                  <Text style={styles.loadingText}>Generating message...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.previewBubble}>
                    <Text style={styles.previewText}>{messagePreview}</Text>
                  </View>
                  <View style={styles.platformBadge}>
                    <Text style={styles.platformBadgeText}>
                      {platform === 'whatsapp' ? 'WhatsApp' : 'Messages'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <ContinueButton onPress={handleContinue} label="Preview & Send" />
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
  platformContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  platformCard: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  platformCardSelected: {
    backgroundColor: Colors.background,
    borderColor: Colors.gradientStart,
  },
  platformIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  platformLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  platformLabelSelected: {
    color: Colors.text,
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  modeCard: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modeCardSelected: {
    backgroundColor: Colors.background,
    borderColor: Colors.gradientStart,
    borderWidth: 2,
  },
  modeLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  modeLabelSelected: {
    color: Colors.gradientStart,
  },
  modeDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  previewSection: {
    marginBottom: Spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  previewHeaderLeft: {
    flex: 1,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  regenerateText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.gradientStart,
  },
  regenerateTextDisabled: {
    color: Colors.textSecondary,
  },
  previewCard: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  previewBubble: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  previewText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  platformBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.sm,
  },
  platformBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
});
