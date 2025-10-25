import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Note, Microphone2, Lamp } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function NotesScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, completeDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [notes, setNotes] = useState(draft.initial_notes || '');
  const [isRecording, setIsRecording] = useState(false);

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Save notes
    if (notes.trim()) {
      updateDraft({ initial_notes: notes.trim() });
    }
    
    await saveDraft();
    
    // Complete the profile (changes status to 'active')
    const result = await completeDraft();
    
    if (result.success) {
      // Navigate to success celebration screen
      router.replace('/date-profile/success');
    } else {
      Alert.alert('Error', result.error || 'Failed to complete profile');
    }
  };

  const handleCancel = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const handleSaveAsDraft = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (notes.trim()) {
      updateDraft({ initial_notes: notes.trim() });
    }
    
    await saveDraft();
    router.back();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleMicrophone = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // TODO: Implement voice recording
    Alert.alert(
      'Voice Input',
      'Voice recording feature coming soon! For now, please type your notes.',
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        <OnboardingLayout
          currentStep={13}
          totalSteps={13}
          icon={Note}
          title="Personal notes"
          helperText="Add any details that will help us understand them better"
          onContinue={handleContinue}
          canContinue={notes.trim().length > 0}
          showSkip={false}
          onCancel={handleCancel}
          onSaveAsDraft={handleSaveAsDraft}
        >
          <View style={styles.container}>
            {/* Text Input with Microphone */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="e.g., Loves Italian food, allergic to cats, works in tech, enjoys hiking on weekends..."
                placeholderTextColor={Colors.textLight}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={8}
                maxLength={500}
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleMicrophone}
                activeOpacity={0.7}
              >
                <Microphone2 size={24} color="black" variant="Bold" />
              </TouchableOpacity>
            </View>
            <Text style={styles.charCount}>
              {notes.length}/500 characters
            </Text>

            {/* Pro Tips - Styled like location screen */}
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Lamp size={20} color={Colors.textWhite} variant="Bold" />
                <Text style={styles.tipsTitle}>What to include:</Text>
              </View>
              <Text style={styles.tipText}>• Food preferences and allergies</Text>
              <Text style={styles.tipText}>• Hobbies and favorite activities</Text>
              <Text style={styles.tipText}>• Career and education</Text>
              <Text style={styles.tipText}>• Personality traits</Text>
              <Text style={styles.tipText}>• Conversation topics they enjoy</Text>
            </View>
          </View>
        </OnboardingLayout>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  inputContainer: {
    position: 'relative',
  },
  textArea: {
    height: 140,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    paddingRight: 56, // Space for mic button
    fontSize: FontSizes.md,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  micButton: {
    position: 'absolute',
    right: Spacing.sm,
    bottom: Spacing.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tipsContainer: {
    backgroundColor: Colors.text,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    marginLeft: Spacing.xs,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});
