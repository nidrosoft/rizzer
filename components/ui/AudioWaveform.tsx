/**
 * Audio Waveform Component
 * Animated waveform visualization for audio recording
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/theme';

interface AudioWaveformProps {
  isRecording: boolean;
  color?: string;
}

export default function AudioWaveform({ isRecording, color = Colors.gradientStart }: AudioWaveformProps) {
  // Create animated values for each bar
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.5)).current;
  const bar3 = useRef(new Animated.Value(0.8)).current;
  const bar4 = useRef(new Animated.Value(1)).current;
  const bar5 = useRef(new Animated.Value(0.8)).current;
  const bar6 = useRef(new Animated.Value(0.5)).current;
  const bar7 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isRecording) {
      // Create staggered animations for each bar
      const createAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: false,
            }),
            Animated.timing(animValue, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: false,
            }),
          ])
        );
      };

      // Start all animations with different delays
      Animated.parallel([
        createAnimation(bar1, 0),
        createAnimation(bar2, 50),
        createAnimation(bar3, 100),
        createAnimation(bar4, 150),
        createAnimation(bar5, 100),
        createAnimation(bar6, 50),
        createAnimation(bar7, 0),
      ]).start();
    } else {
      // Reset all bars
      bar1.setValue(0.3);
      bar2.setValue(0.5);
      bar3.setValue(0.8);
      bar4.setValue(1);
      bar5.setValue(0.8);
      bar6.setValue(0.5);
      bar7.setValue(0.3);
    }
  }, [isRecording]);

  const bars = [bar1, bar2, bar3, bar4, bar5, bar6, bar7];

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: bar.interpolate({
                inputRange: [0, 1],
                outputRange: ['20%', '100%'],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 4,
  },
});
