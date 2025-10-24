import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function ImportantDatesScreen() {
  const router = useRouter();
  const [firstDate, setFirstDate] = useState<Date | undefined>(undefined);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [anniversary, setAnniversary] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState<'firstDate' | 'birthday' | 'anniversary' | null>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Add date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(null);
    }
    if (selectedDate) {
      if (showPicker === 'firstDate') setFirstDate(selectedDate);
      else if (showPicker === 'birthday') setBirthday(selectedDate);
      else if (showPicker === 'anniversary') setAnniversary(selectedDate);
    }
  };

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/date-profile/notes');
  };

  const handleSkip = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/date-profile/notes');
  };

  const hasAnyDate = !!(firstDate || birthday || anniversary);

  return (
    <OnboardingLayout
      currentStep={6}
      totalSteps={8}
      icon={Calendar}
      title="Important dates"
      helperText="Never forget special moments - we'll remind you when they're coming up"
      onContinue={handleContinue}
      canContinue={hasAnyDate}
      showSkip={true}
      onSkip={handleSkip}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.dateCard} 
          activeOpacity={0.7}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowPicker('firstDate');
          }}
        >
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>First Date</Text>
            <Text style={styles.dateHint}>When did you first go out?</Text>
          </View>
          <Text style={styles.dateValue}>{formatDate(firstDate)}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity 
          style={styles.dateCard} 
          activeOpacity={0.7}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowPicker('birthday');
          }}
        >
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Birthday</Text>
            <Text style={styles.dateHint}>Their special day</Text>
          </View>
          <Text style={styles.dateValue}>{formatDate(birthday)}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity 
          style={styles.dateCard} 
          activeOpacity={0.7}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowPicker('anniversary');
          }}
        >
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Anniversary</Text>
            <Text style={styles.dateHint}>Relationship milestone</Text>
          </View>
          <Text style={styles.dateValue}>{formatDate(anniversary)}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />

        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={showPicker === 'firstDate' ? (firstDate || new Date()) : 
                     showPicker === 'birthday' ? (birthday || new Date()) : 
                     (anniversary || new Date())}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => setShowPicker(null)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.note}>
          💡 Tip: You can add or edit these dates anytime from the profile
        </Text>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  dateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  dateHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  dateValue: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.medium,
  },
  pickerContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  doneButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    minWidth: 100,
  },
  doneButtonText: {
    color: Colors.textWhite,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  note: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 20,
  },
});
