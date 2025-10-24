/**
 * Step 2: Occasion Selection
 * Second step in the new investigation flow
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { OccasionType } from '@/types/gifts';
import StepLayout from '@/components/gifts/StepLayout';
import OccasionSelector from '@/components/gifts/OccasionSelector';
import ContinueButton from '@/components/gifts/ContinueButton';

export default function Step2OccasionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);

  const handleOccasionSelect = (occasionId: OccasionType) => {
    setSelectedOccasion(occasionId);
  };

  const handleContinue = () => {
    if (!selectedOccasion) return;
    
    // Navigate to Step 3 with accumulated data
    router.push({
      pathname: '/gifts/steps/step3-details',
      params: {
        ...params,
        occasion: selectedOccasion,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StepLayout
      title="New Investigation"
      currentStep={1}
      totalSteps={5}
      stepTitle="Select Occasion"
      onBack={handleBack}
    >
      <View style={styles.container}>
        {/* Occasion List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <OccasionSelector
              selectedOccasion={selectedOccasion}
              onOccasionSelect={handleOccasionSelect}
            />
          </View>
        </ScrollView>

        {/* Continue Button */}
        {selectedOccasion && (
          <ContinueButton onPress={handleContinue} />
        )}
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
});
