import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ruler } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Picker } from '@react-native-picker/picker';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function HeightScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [unit, setUnit] = useState<'FT' | 'CM'>('FT');
  
  // Generate combined feet and inches (4'0" to 7'11")
  const heights: string[] = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      heights.push(`${ft}' ${inch}"`);
    }
  }
  
  // Initialize from draft or default
  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  };
  
  const initialHeight = draft.height ? cmToFeetInches(draft.height) : "5' 8\"";
  const [selectedHeight, setSelectedHeight] = useState(initialHeight);
  
  const centimeters = Array.from({ length: 101 }, (_, i) => i + 140); // 140-240 cm
  const [selectedCm, setSelectedCm] = useState(draft.height || 173);

  // Convert feet/inches to cm
  const convertToCm = (heightStr: string) => {
    const match = heightStr.match(/(\d+)' (\d+)"/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2]);
      return Math.round((feet * 30.48) + (inches * 2.54));
    }
    return 173;
  };

  const handleUnitToggle = (newUnit: 'FT' | 'CM') => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUnit(newUnit);
  };

  const handleHeightSelect = (value: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (unit === 'FT') {
      setSelectedHeight(value);
    } else {
      setSelectedCm(value);
    }
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const heightInCm = unit === 'FT' ? convertToCm(selectedHeight) : selectedCm;
    updateDraft({ height: heightInCm });
    await saveDraft();
    setCurrentStep(6);
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
    
    const heightInCm = unit === 'FT' ? convertToCm(selectedHeight) : selectedCm;
    updateDraft({ height: heightInCm });
    await saveDraft();
    router.back();
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={13}
      icon={Ruler}
      title="How tall are they?"
      helperText="Select their height and preferred unit"
      onContinue={handleContinue}
      canContinue={true}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      {/* Height Picker */}
      <View style={styles.pickerContainer}>
        {unit === 'FT' ? (
          <Picker
            selectedValue={selectedHeight}
            onValueChange={handleHeightSelect}
            style={styles.picker}
          >
            {heights.map((height) => (
              <Picker.Item key={height} label={height} value={height} />
            ))}
          </Picker>
        ) : (
          <Picker
            selectedValue={selectedCm}
            onValueChange={handleHeightSelect}
            style={styles.picker}
          >
            {centimeters.map((cm) => (
              <Picker.Item key={cm} label={`${cm} cm`} value={cm} />
            ))}
          </Picker>
        )}
      </View>

      {/* Unit Toggle */}
      <View style={styles.unitToggleContainer}>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'FT' && styles.unitButtonActive]}
            onPress={() => handleUnitToggle('FT')}
            activeOpacity={0.7}
          >
            <Text style={[styles.unitText, unit === 'FT' && styles.unitTextActive]}>FT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'CM' && styles.unitButtonActive]}
            onPress={() => handleUnitToggle('CM')}
            activeOpacity={0.7}
          >
            <Text style={[styles.unitText, unit === 'CM' && styles.unitTextActive]}>CM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: 200,
    marginVertical: Spacing.xl,
    position: 'relative',
    justifyContent: 'center',
  },
  picker: {
    height: 200,
  },
  unitToggleContainer: {
    alignItems: 'flex-end',
    marginTop: Spacing.lg,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  unitButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    minWidth: 50,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: Colors.background,
  },
  unitText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  unitTextActive: {
    color: Colors.text,
  },
});
