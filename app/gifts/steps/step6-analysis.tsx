/**
 * Step 3: AI Analysis & Gift Suggestions
 * Sherlock analyzes the investigation and provides gift recommendations
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import StepLayout from '@/components/gifts/StepLayout';
import GiftSuggestionCard from '@/components/gifts/GiftSuggestionCard';
import AnalysisProgress from '@/components/gifts/AnalysisProgress';
import ContinueButton from '@/components/gifts/ContinueButton';
import SectionHeader from '@/components/ui/SectionHeader';
import { getGiftSuggestions } from '@/data/mockGiftSuggestions';
import { AnalysisProgress as AnalysisProgressType, GiftSuggestion } from '@/types/gifts';

export default function Step3AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgressType>({
    stage: 'analyzing',
    progress: 0,
    message: 'Analyzing recipient information and preferences...',
  });
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<GiftSuggestion | null>(null);

  useEffect(() => {
    // Simulate AI analysis process
    simulateAnalysis();
  }, []);

  const simulateAnalysis = async () => {
    // Stage 1: Analyzing (0-40%)
    await updateProgress('analyzing', 0, 'Analyzing recipient information and preferences...');
    await delay(800);
    await updateProgress('analyzing', 20, 'Processing relationship context...');
    await delay(800);
    await updateProgress('analyzing', 40, 'Understanding occasion requirements...');
    await delay(800);

    // Stage 2: Generating (40-90%)
    await updateProgress('generating', 50, 'Searching gift database...');
    await delay(800);
    await updateProgress('generating', 65, 'Matching preferences with gift options...');
    await delay(800);
    await updateProgress('generating', 80, 'Ranking suggestions by relevance...');
    await delay(800);
    await updateProgress('generating', 90, 'Finalizing recommendations...');
    await delay(800);

    // Stage 3: Completed (100%)
    await updateProgress('completed', 100, 'Analysis complete! Here are your personalized gift suggestions.');
    
    // Load suggestions
    const giftSuggestions = getGiftSuggestions();
    setSuggestions(giftSuggestions);
  };

  const updateProgress = (
    stage: AnalysisProgressType['stage'],
    progress: number,
    message: string
  ): Promise<void> => {
    return new Promise((resolve) => {
      setAnalysisProgress({ stage, progress, message });
      resolve();
    });
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleSuggestionPress = (suggestion: GiftSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleContinue = () => {
    if (!selectedSuggestion) return;

    // Navigate to Step 5 with all data including selected gift
    router.push({
      pathname: '/gifts/steps/step5-purchase',
      params: {
        ...params,
        selectedGiftId: selectedSuggestion.id,
        selectedGiftTitle: selectedSuggestion.title,
        selectedGiftPrice: selectedSuggestion.price,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const isAnalyzing = analysisProgress.stage !== 'completed';

  return (
    <StepLayout
      title="New Investigation"
      currentStep={3}
      totalSteps={5}
      stepTitle="Gift Suggestions"
      onBack={handleBack}
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Analysis Progress */}
          {isAnalyzing && (
            <View style={styles.analysisContainer}>
              <AnalysisProgress progress={analysisProgress} />
            </View>
          )}

          {/* Gift Suggestions */}
          {!isAnalyzing && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <SectionHeader
                title="Personalized Suggestions"
                subtitle={`${suggestions.length} gifts curated by Sherlock AI`}
              />

              <View style={styles.suggestions}>
                {suggestions.map((suggestion) => (
                  <View key={suggestion.id} style={styles.suggestionWrapper}>
                    <GiftSuggestionCard
                      suggestion={suggestion}
                      onPress={handleSuggestionPress}
                    />
                    {selectedSuggestion?.id === suggestion.id && (
                      <View style={styles.selectedIndicator}>
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedText}>✓ Selected</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💡 Tap on a gift to select it, then continue to review your investigation details.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

          {/* Continue Button */}
          {selectedSuggestion && (
            <ContinueButton onPress={handleContinue} />
          )}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  analysisContainer: {
    paddingTop: Spacing.xxl,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  suggestions: {
    marginTop: Spacing.md,
  },
  suggestionWrapper: {
    position: 'relative',
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    zIndex: 3,
  },
  selectedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  infoBox: {
    backgroundColor: `${Colors.gradientStart}10`,
    padding: Spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gradientStart,
    marginTop: Spacing.lg,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
});
