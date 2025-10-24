/**
 * Reusable StepIndicator Component
 * Beautiful stepper UI showing progress through multi-step flows
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TickCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface Step {
  label: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  accentColor?: string;
  inGradient?: boolean;
}

export default function StepIndicator({ 
  steps, 
  currentStep,
  accentColor = Colors.purple,
  inGradient = false,
}: StepIndicatorProps) {
  // Colors for gradient mode (white/light) vs normal mode (colored)
  const circleColor = inGradient ? Colors.textWhite : Colors.backgroundGray;
  const activeCircleColor = inGradient ? Colors.textWhite : accentColor;
  const completedCircleColor = inGradient ? Colors.textWhite : accentColor;
  const textColor = inGradient ? 'rgba(255, 255, 255, 0.8)' : Colors.textSecondary;
  const activeTextColor = inGradient ? Colors.textWhite : accentColor;
  const completedTextColor = inGradient ? Colors.textWhite : Colors.text;
  const connectorColor = inGradient ? 'rgba(255, 255, 255, 0.4)' : Colors.borderLight;
  const completedConnectorColor = inGradient ? Colors.textWhite : accentColor;
  const numberColor = inGradient ? Colors.text : Colors.textSecondary;
  const activeNumberColor = inGradient ? Colors.text : accentColor;

  return (
    <View style={[styles.container, inGradient && styles.containerInGradient]}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = step.completed;
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepContainer}>
            {/* Step Circle */}
            <View style={styles.stepCircleContainer}>
              <View
                style={[
                  styles.stepCircle,
                  { borderColor: inGradient ? 'rgba(255, 255, 255, 0.3)' : Colors.borderLight },
                  isCompleted && { 
                    backgroundColor: completedCircleColor,
                    borderColor: completedCircleColor,
                  },
                  isActive && !isCompleted && { 
                    borderColor: activeCircleColor, 
                    borderWidth: 2,
                    backgroundColor: inGradient ? 'rgba(255, 255, 255, 0.2)' : `${accentColor}15`,
                  },
                ]}
              >
                {isCompleted ? (
                  <TickCircle 
                    size={18} 
                    color={inGradient ? Colors.text : Colors.textWhite} 
                    variant="Bold" 
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      { color: numberColor },
                      isActive && { 
                        color: activeNumberColor, 
                        fontWeight: FontWeights.bold 
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connecting Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: connectorColor },
                    isCompleted && { backgroundColor: completedConnectorColor },
                  ]}
                />
              )}
            </View>

            {/* Step Label */}
            <Text
              style={[
                styles.stepLabel,
                { color: textColor },
                isActive && { color: activeTextColor, fontWeight: FontWeights.semibold },
                isCompleted && { color: completedTextColor },
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md + 4,
  },
  containerInGradient: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 36,
    marginBottom: Spacing.xs - 2,
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    zIndex: 2,
    position: 'absolute',
    left: '50%',
    marginLeft: -18,
  },
  stepNumber: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  connector: {
    position: 'absolute',
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: Colors.borderLight,
    zIndex: 1,
    top: '50%',
    marginTop: -1,
  },
  stepLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 42,
    width: '100%',
    paddingHorizontal: 2,
  },
});
