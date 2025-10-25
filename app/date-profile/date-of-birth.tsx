import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Calendar } from 'iconsax-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';
import { normalize } from '@/utils/responsive';

export default function DateOfBirthScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [date, setDate] = useState(
    draft.date_of_birth ? new Date(draft.date_of_birth) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [hasSelected, setHasSelected] = useState(!!draft.date_of_birth);

  // Calculate age from date of birth
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calculate zodiac sign from date of birth
  const calculateZodiacSign = (birthDate: Date): string => {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate);
      setHasSelected(true);
      
      // Calculate age and zodiac
      const age = calculateAge(selectedDate);
      const zodiacSign = calculateZodiacSign(selectedDate);
      
      // Update draft
      updateDraft({
        date_of_birth: selectedDate.toISOString().split('T')[0],
        age,
        zodiac_sign: zodiacSign,
      });
    }
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Save draft
    await saveDraft();
    
    // Update step and navigate
    setCurrentStep(2);
    router.push('/date-profile/gender');
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
    await saveDraft();
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const canContinue = hasSelected;

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={13}
      icon={Calendar}
      title="When's their birthday?"
      helperText="We'll calculate their age and zodiac sign"
      onContinue={handleContinue}
      canContinue={canContinue}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <View style={styles.container}>
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

        {/* Calculated Info */}
        {hasSelected && (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{calculateAge(date)} years old</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Zodiac Sign:</Text>
              <Text style={styles.infoValue}>{calculateZodiacSign(date)}</Text>
            </View>
          </View>
        )}

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
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    // No gap needed
  },
  dateContainer: {
    marginBottom: Spacing.xl,
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
  infoContainer: {
    backgroundColor: Colors.text,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: FontWeights.medium,
  },
  infoValue: {
    fontSize: FontSizes.lg,
    color: Colors.textWhite,
    fontWeight: FontWeights.semibold,
  },
});
