/**
 * useOnboardingStep Hook
 * Simplifies onboarding screen implementation
 */

import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Alert } from 'react-native';

interface UseOnboardingStepOptions {
  stepNumber: number;
  nextRoute: string;
  validateData?: () => boolean;
  getDataToSave?: () => any;
}

export function useOnboardingStep({
  stepNumber,
  nextRoute,
  validateData,
  getDataToSave,
}: UseOnboardingStepOptions) {
  const router = useRouter();
  const { updateData, setCurrentStep, saveProgress, isSaving } = useOnboardingStore();

  const handleContinue = async () => {
    // Validate data if validator provided
    if (validateData && !validateData()) {
      return;
    }

    try {
      // Get data to save if provider function exists
      if (getDataToSave) {
        const dataToSave = getDataToSave();
        updateData(dataToSave);
      }

      // Update current step
      setCurrentStep(stepNumber);

      // Save progress to database
      await saveProgress();

      // Navigate to next screen
      router.push(nextRoute as any);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to save progress. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    handleContinue,
    handleBack,
    isSaving,
    updateData,
  };
}
