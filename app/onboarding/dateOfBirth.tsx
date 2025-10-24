import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Calendar } from 'iconsax-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function DateOfBirthScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 2,
    nextRoute: '/onboarding/gender',
    validateData: () => hasSelected,
    getDataToSave: () => ({
      dateOfBirth: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
    }),
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Haptic feedback on date change
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      setHasSelected(true);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isValid = hasSelected;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepper}>
          <View style={styles.iconCircle}>
            <Calendar size={24} color={Colors.text} variant="Outline" />
          </View>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index === 0 && styles.stepDotFilled,
                index === 1 && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>When's your birthday?</Text>

        {/* Date Display */}
        <TouchableOpacity 
          style={styles.dateContainer}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>
            {hasSelected ? formatDate(date) : 'Select date'}
          </Text>
          <View style={styles.underline} />
        </TouchableOpacity>

        <Text style={styles.helperText}>
          You must be 18 or older to use Rizzer
        </Text>

        {/* Date Picker */}
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1940, 0, 1)}
          />
        )}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, (!isValid || isSaving) && styles.continueButtonDisabled]}
            onPress={saveAndContinue}
            disabled={!isValid || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <ArrowRight 
                size={28} 
                color={isValid ? Colors.background : Colors.border} 
                variant="Outline"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepperContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
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
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xxl,
  },
  dateContainer: {
    marginBottom: Spacing.md,
  },
  dateText: {
    fontSize: normalize(20),
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: Spacing.xl,
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
});
