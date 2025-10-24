import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ruler } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Picker } from '@react-native-picker/picker';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function HeightScreen() {
  const router = useRouter();
  const [unit, setUnit] = useState<'FT' | 'CM'>('FT');
  const [selectedFeet, setSelectedFeet] = useState(5);
  const [selectedInches, setSelectedInches] = useState(5);
  const [selectedCm, setSelectedCm] = useState(165);

  // Generate combined feet and inches (4'0" to 7'11")
  const heights: string[] = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      heights.push(`${ft}' ${inch}"`);
    }
  }
  const [selectedHeight, setSelectedHeight] = useState("5' 5\"");
  
  const centimeters = Array.from({ length: 101 }, (_, i) => i + 140); // 140-240 cm

  // Convert feet/inches to cm
  const convertToCm = (heightStr: string) => {
    const match = heightStr.match(/(\d+)' (\d+)"/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2]);
      return Math.round((feet * 30.48) + (inches * 2.54));
    }
    return 165;
  };

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 4,
    nextRoute: '/onboarding/ethnicity',
    validateData: () => true,
    getDataToSave: () => ({
      height: unit === 'CM' ? selectedCm : convertToCm(selectedHeight),
    }),
  });

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

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={12}
      icon={Ruler}
      title="How tall are you?"
      helperText="Select your height and preferred unit"
      onContinue={saveAndContinue}
      canContinue={!isSaving}
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
