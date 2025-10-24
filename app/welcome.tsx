import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { MessageText1, Calendar, Gift, SearchNormal1, Heart } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

const features = [
  {
    icon: MessageText1,
    title: 'AI Rizz Lines & Openers',
    description: 'Get witty conversation starters that actually work',
    bgColor: '#FFEBEB',
    iconBgColor: '#FFCCCC',
    iconColor: '#FF6B6B',
  },
  {
    icon: Calendar,
    title: 'Smart Date Planning',
    description: 'AI creates perfect date itineraries in seconds',
    bgColor: '#E0F2FE',
    iconBgColor: '#BAE6FD',
    iconColor: '#3B82F6',
  },
  {
    icon: Gift,
    title: 'Gift Finder Assistant',
    description: 'Never stress about gifts again—AI finds the perfect one',
    bgColor: '#FFEDD5',
    iconBgColor: '#FED7AA',
    iconColor: '#F97316',
  },
  {
    icon: SearchNormal1,
    title: 'Discover Events & Spots',
    description: 'Find romantic places and events near you',
    bgColor: '#DCFCE7',
    iconBgColor: '#BBF7D0',
    iconColor: '#22C55E',
  },
];

const TypewriterText = ({ text, shouldStart, onComplete }: { text: string; shouldStart: boolean; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (shouldStart && !hasStarted) {
      setHasStarted(true);
      setCurrentIndex(0);
      setDisplayedText('');
    }
  }, [shouldStart, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        // Haptic feedback on each character
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 15); // Very fast typing speed

      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, hasStarted, onComplete]);

  return <Text style={styles.featureTitle}>{displayedText}</Text>;
};

const TypewriterDescription = ({ text, shouldStart, onComplete }: { text: string; shouldStart: boolean; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (shouldStart && !hasStarted) {
      setHasStarted(true);
      setCurrentIndex(0);
      setDisplayedText('');
    }
  }, [shouldStart, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10); // Very fast for description

      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, hasStarted, onComplete]);

  return <Text style={styles.featureDescription}>{displayedText}</Text>;
};

const AnimatedFeature = ({ 
  feature, 
  shouldAnimate,
  shouldZoom,
  onComplete 
}: { 
  feature: typeof features[0]; 
  shouldAnimate: boolean;
  shouldZoom: boolean;
  onComplete: () => void;
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [titleComplete, setTitleComplete] = useState(false);
  const [descComplete, setDescComplete] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    // Haptic feedback on appear
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Scale animation with bounce
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }),
    ]).start();
    
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [shouldAnimate]);

  // Second zoom effect after button appears
  useEffect(() => {
    if (!shouldZoom) return;

    // Stronger haptic feedback on zoom
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Faster zoom in and out
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.15,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shouldZoom]);

  useEffect(() => {
    if (titleComplete && descComplete) {
      // Small delay before moving to next feature
      setTimeout(onComplete, 100);
    }
  }, [titleComplete, descComplete, onComplete]);

  const Icon = feature.icon;

  return (
    <Animated.View style={[styles.featureCard, { backgroundColor: feature.bgColor, transform: [{ scale }], opacity }]}>
      <View style={[styles.iconContainer, { backgroundColor: feature.iconBgColor }]}>
        <Icon size={24} color={feature.iconColor} variant="Bulk" />
      </View>
      <View style={styles.featureContent}>
        <TypewriterText 
          text={feature.title} 
          shouldStart={shouldAnimate} 
          onComplete={() => setTitleComplete(true)}
        />
        <TypewriterDescription 
          text={feature.description} 
          shouldStart={titleComplete} 
          onComplete={() => setDescComplete(true)}
        />
      </View>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [zoomFeatureIndex, setZoomFeatureIndex] = useState(-1);
  const buttonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Feature 1: 0-2s
    // Feature 2: 2-4s
    // Feature 3: 4-6s
    // Feature 4: 6-8s
    // Button: 8s
    // Zoom 1: 9s
    // Zoom 2: 10s
    // Zoom 3: 11s
    // Zoom 4: 12s
    
    const timers: NodeJS.Timeout[] = [];

    // Show features at 2-second intervals
    features.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentFeatureIndex(index);
      }, index * 2000);
      timers.push(timer);
    });

    // Show button after 8 seconds (all features done)
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
      
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 8000);
    timers.push(buttonTimer);

    // Zoom effects start at 9 seconds, 0.5 seconds apart (faster)
    features.forEach((_, index) => {
      const zoomTimer = setTimeout(() => {
        setZoomFeatureIndex(index);
      }, 9000 + (index * 500));
      timers.push(zoomTimer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleGetStarted = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.replace('/onboarding/name');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Hey, Rizzer! 😎</Text>
        <Text style={styles.subtitle}>
          Your AI dating wingman for conversations,{'\n'}dates, gifts, and more
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => {
          // Only render features up to current index
          if (index > currentFeatureIndex) return null;
          
          return (
            <AnimatedFeature 
              key={index} 
              feature={feature} 
              shouldAnimate={index === currentFeatureIndex}
              shouldZoom={index === zoomFeatureIndex}
              onComplete={() => {}} // No-op, using timed intervals instead
            />
          );
        })}
      </View>

      {/* Get Started Button */}
      {showButton && (
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }], opacity: buttonScale }]}>
          <Text style={styles.setupText}>Let's set up your account</Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>This will only take a few minutes</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  headerContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: normalize(13),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: normalize(18),
    marginBottom: Spacing.sm,
  },
  featuresContainer: {
    flex: 1,
    gap: 10,
    marginBottom: Spacing.sm,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: normalize(15),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(16),
  },
  buttonContainer: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  setupText: {
    fontSize: normalize(13),
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  getStartedButton: {
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.text,
    height: normalize(52),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  buttonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  footerText: {
    fontSize: normalize(10),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
