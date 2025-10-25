import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ruler } from 'iconsax-react-native';
import { Picker } from '@react-native-picker/picker';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';
import { normalize } from '@/utils/responsive';

export default function HeightScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  // Convert cm to feet/inches if draft has height
  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const feetInchesToCm = (feet: number, inches: number) => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  const initialHeight = draft.height ? cmToFeetInches(draft.height) : { feet: 5, inches: 8 };
  
  const [unit, setUnit] = useState<'FT' | 'CM'>('FT');
  const [selectedFeet, setSelectedFeet] = useState(initialHeight.feet);
  const [selectedInches, setSelectedInches] = useState(initialHeight.inches);
  const [selectedCm, setSelectedCm] = useState(draft.height || 173);

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const heightInCm = unit === 'FT' 
      ? feetInchesToCm(selectedFeet, selectedInches)
      : selectedCm;
    
    updateDraft({ height: heightInCm });
    await saveDraft();
    setCurrentStep(5);
    router.push('/date-profile/location');
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
    
    const heightInCm = unit === 'FT' 
      ? feetInchesToCm(selectedFeet, selectedInches)
      : selectedCm;
    
    updateDraft({ height: heightInCm });
    await saveDraft();
    router.back();
  };

  const toggleUnit = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (unit === 'FT') {
      // Convert to CM
      const cm = feetInchesToCm(selectedFeet, selectedInches);
      setSelectedCm(cm);
      setUnit('CM');
    } else {
      // Convert to FT/IN
      const { feet, inches } = cmToFeetInches(selectedCm);
      setSelectedFeet(feet);
      setSelectedInches(inches);
      setUnit('FT');
    }
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={13}
      icon={Ruler}
      title="How tall are they?"
      helperText="This helps us personalize suggestions"
      onContinue={handleContinue}
      canContinue={true}
      showSkip={true}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <View style={styles.container}>
        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'FT' && styles.unitButtonActive]}
            onPress={() => unit !== 'FT' && toggleUnit()}
            activeOpacity={0.7}
          >
            <Text style={[styles.unitText, unit === 'FT' && styles.unitTextActive]}>
              Feet/Inches
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'CM' && styles.unitButtonActive]}
            onPress={() => unit !== 'CM' && toggleUnit()}
            activeOpacity={0.7}
          >
            <Text style={[styles.unitText, unit === 'CM' && styles.unitTextActive]}>
              Centimeters
            </Text>
          </TouchableOpacity>
        </View>

        {/* Height Pickers */}
        {unit === 'FT' ? (
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Feet</Text>
              <Picker
                selectedValue={selectedFeet}
                onValueChange={(value) => setSelectedFeet(value)}
                style={styles.picker}
              >
                {[...Array(5)].map((_, i) => {
                  const feet = i + 3; // 3-7 feet
                  return <Picker.Item key={feet} label={`${feet}'`} value={feet} />;
                })}
              </Picker>
            </View>
            
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Inches</Text>
              <Picker
                selectedValue={selectedInches}
                onValueChange={(value) => setSelectedInches(value)}
                style={styles.picker}
              >
                {[...Array(12)].map((_, i) => (
                  <Picker.Item key={i} label={`${i}"`} value={i} />
                ))}
              </Picker>
            </View>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <View style={[styles.pickerWrapper, { flex: 1 }]}>
              <Text style={styles.pickerLabel}>Centimeters</Text>
              <Picker
                selectedValue={selectedCm}
                onValueChange={(value) => setSelectedCm(value)}
                style={styles.picker}
              >
                {[...Array(121)].map((_, i) => {
                  const cm = i + 100; // 100-220 cm
                  return <Picker.Item key={cm} label={`${cm} cm`} value={cm} />;
                })}
              </Picker>
            </View>
          </View>
        )}

        {/* Display */}
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {unit === 'FT' 
              ? `${selectedFeet}' ${selectedInches}" (${feetInchesToCm(selectedFeet, selectedInches)} cm)`
              : `${selectedCm} cm (${cmToFeetInches(selectedCm).feet}' ${cmToFeetInches(selectedCm).inches}")`
            }
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    // No gap needed
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  unitButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: Colors.background,
  },
  unitText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  unitTextActive: {
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  picker: {
    backgroundColor: Colors.background,
  },
  displayContainer: {
    backgroundColor: 'rgba(171, 71, 188, 0.05)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  displayText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
