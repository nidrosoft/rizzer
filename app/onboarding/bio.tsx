import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit, Microphone } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function BioScreen() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const maxLength = 1000;

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 10,
    nextRoute: '/onboarding/occupation',
    validateData: () => bio.trim().length >= 50,
    getDataToSave: () => ({ bio: bio.trim() }),
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleVoiceInput = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Request microphone permission
    Alert.alert(
      'Voice Input',
      'Allow Rizzers to access your microphone to record your bio?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            setIsRecording(true);
            // TODO: Implement voice recording logic
            Alert.alert('Voice Recording', 'Voice recording will be implemented in the backend');
            setTimeout(() => setIsRecording(false), 1000);
          },
        },
      ]
    );
  };

  return (
    <OnboardingLayout
      currentStep={10}
      totalSteps={16}
      icon={Edit}
      title="Tell us about yourself"
      helperText="Share your story - the more you tell us, the better we can help you connect"
      onContinue={saveAndContinue}
      canContinue={bio.trim().length >= 50 && !isSaving}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={textInputRef}
                style={styles.bioInput}
                placeholder="Tell us about yourself... What makes you unique? What are your passions? What are you looking for?"
                placeholderTextColor={Colors.textLight}
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={maxLength}
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
              />
          <TouchableOpacity 
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleVoiceInput}
            activeOpacity={0.7}
          >
            <Microphone 
              size={18} 
              color={isRecording ? Colors.background : Colors.text} 
              variant={isRecording ? "Bold" : "Outline"}
            />
          </TouchableOpacity>
            </View>
            <View style={styles.charCountContainer}>
          <Text style={styles.charCount}>
            {bio.length}/{maxLength} characters
          </Text>
          <Text style={[styles.charCount, bio.length < 50 && styles.charCountWarning]}>
            {bio.length < 50 ? `${50 - bio.length} more needed` : '✓'}
          </Text>
        </View>
        
        {/* Stacked Sticky Notes Effect */}
        <View style={styles.stickyNotesWrapper}>
          {/* Bottom note (shadow layer) */}
          <View style={styles.stickyNoteBottom} />
          {/* Middle note (shadow layer) */}
          <View style={styles.stickyNoteMiddle} />
          {/* Top note (main content) */}
          <View style={styles.tipsContainer}>
            {/* 3D Pin */}
            <View style={styles.pinContainer}>
              <View style={styles.pinShadow} />
              <View style={styles.pinNeedle} />
              <View style={styles.pinHead} />
              <View style={styles.pinHighlight} />
            </View>
            
            <Text style={styles.tipsTitle}>Create an Amazing Bio:</Text>
            <View style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Share your interests, hobbies, and what makes you unique</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Tell us your dating style - casual, adventurous, romantic?</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>What conversation topics do you enjoy? Music, travel, food?</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Use voice input for a more natural, flowing description</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>The more we know, the better we can coach and guide you</Text>
            </View>
          </View>
        </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  bioInput: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    paddingRight: 60,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 180,
  },
  micButton: {
    position: 'absolute',
    right: Spacing.sm,
    bottom: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  micButtonActive: {
    backgroundColor: Colors.text,
  },
  charCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  charCountWarning: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  stickyNotesWrapper: {
    position: 'relative',
    marginTop: Spacing.md,
  },
  stickyNoteBottom: {
    position: 'absolute',
    top: 8,
    left: 4,
    right: -4,
    height: '100%',
    backgroundColor: '#E8E6E1',
    borderRadius: 2,
    transform: [{ rotate: '1deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  stickyNoteMiddle: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: -2,
    height: '100%',
    backgroundColor: '#F0EEE9',
    borderRadius: 2,
    transform: [{ rotate: '0.5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tipsContainer: {
    backgroundColor: '#F5F3EE',
    padding: Spacing.lg,
    paddingTop: 40,
    borderRadius: 2,
    transform: [{ rotate: '-0.5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
  },
  pinContainer: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 16,
    zIndex: 10,
  },
  pinShadow: {
    position: 'absolute',
    top: 2,
    left: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    transform: [{ scaleX: 1.2 }],
  },
  pinNeedle: {
    position: 'absolute',
    top: 8,
    left: 7,
    width: 2,
    height: 20,
    backgroundColor: '#C0C0C0',
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  pinHead: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E74C3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pinHighlight: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: '#2C3E50',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 18,
    marginRight: Spacing.sm,
    width: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
