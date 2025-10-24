// BACKUP OF ORIGINAL INDEX
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Rizzers';
  const typingSpeed = 80; // milliseconds per character (faster)

  useEffect(() => {
    let currentIndex = 0;
    
    // Typing animation
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        
        // Haptic feedback for each character
        if (Platform.OS === 'ios' && currentIndex > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Navigate to tabs after animation completes
        setTimeout(() => {
          router.replace('/tabs');
        }, 500);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={[styles.container, { paddingTop: insets.top }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.appName}>
          {displayedText}
          <Text style={styles.cursor}>|</Text>
        </Text>
        <Text style={styles.tagline}>Your AI Dating Assistant</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    fontSize: normalize(48),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    marginBottom: 12,
    letterSpacing: 2,
  },
  cursor: {
    opacity: 0.7,
  },
  tagline: {
    fontSize: normalize(16),
    color: Colors.textWhite,
    opacity: 0.9,
    fontWeight: FontWeights.medium,
  },
});
