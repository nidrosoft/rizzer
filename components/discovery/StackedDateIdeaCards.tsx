/**
 * Stacked Date Idea Cards Component
 * Beautiful stacked card effect with 3D rotation like Tinder
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, PanResponder, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Heart, Share, Clock, DollarCircle, Location } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { DateIdea } from '@/types/discovery';

interface StackedDateIdeaCardsProps {
  ideas: DateIdea[];
  onIdeaPress: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

// Vibrant color palettes for match reason badges
const matchReasonColors = [
  { bg: '#FEF3C7', text: '#F59E0B', border: '#FCD34D' }, // Yellow
  { bg: '#DBEAFE', text: '#3B82F6', border: '#93C5FD' }, // Blue
  { bg: '#FCE7F3', text: '#EC4899', border: '#F9A8D4' }, // Pink
  { bg: '#D1FAE5', text: '#10B981', border: '#6EE7B7' }, // Green
  { bg: '#E0E7FF', text: '#6366F1', border: '#A5B4FC' }, // Indigo
  { bg: '#FED7AA', text: '#F97316', border: '#FDBA74' }, // Orange
  { bg: '#E9D5FF', text: '#A855F7', border: '#C084FC' }, // Purple
  { bg: '#CCFBF1', text: '#14B8A6', border: '#5EEAD4' }, // Teal
  { bg: '#FFE4E6', text: '#F43F5E', border: '#FDA4AF' }, // Rose
  { bg: '#FEF9C3', text: '#EAB308', border: '#FDE047' }, // Amber
];

// Colorful backgrounds for action icons
const iconColors = [
  { bg: 'rgba(239, 68, 68, 0.9)', icon: '#FFFFFF' }, // Red
  { bg: 'rgba(236, 72, 153, 0.9)', icon: '#FFFFFF' }, // Pink
  { bg: 'rgba(168, 85, 247, 0.9)', icon: '#FFFFFF' }, // Purple
  { bg: 'rgba(59, 130, 246, 0.9)', icon: '#FFFFFF' }, // Blue
  { bg: 'rgba(16, 185, 129, 0.9)', icon: '#FFFFFF' }, // Green
];

export default function StackedDateIdeaCards({ ideas, onIdeaPress, onSave, onShare }: StackedDateIdeaCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [savedIdeas, setSavedIdeas] = useState<Set<string>>(new Set());
  const swipingRef = React.useRef(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate if horizontal swipe is detected and not currently swiping
        return Math.abs(gestureState.dx) > 5 && !swipingRef.current;
      },
      onPanResponderGrant: () => {
        swipingRef.current = true;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        const swipeThreshold = 80;
        const swipeVelocityThreshold = 0.3;
        
        // Check if swipe is strong enough
        if (
          Math.abs(gesture.dx) > swipeThreshold ||
          Math.abs(gesture.vx) > swipeVelocityThreshold
        ) {
          // Swipe detected - animate card off screen FAST
          const direction = gesture.dx > 0 ? 1 : -1;
          const toValue = direction * 500;
          
          // Haptic feedback
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          
          Animated.timing(pan, {
            toValue: { x: toValue, y: gesture.dy },
            duration: 200, // Fast animation
            useNativeDriver: false,
          }).start(() => {
            // Move to next card and reset
            setCurrentIndex((prev) => (prev + 1) % ideas.length);
            pan.setValue({ x: 0, y: 0 });
            swipingRef.current = false;
          });
        } else {
          // Return to center quickly
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: false,
          }).start(() => {
            swipingRef.current = false;
          });
        }
      },
    })
  ).current;
  const handlePress = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onIdeaPress(id);
  };

  const handleSave = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSavedIdeas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    onSave(id);
  };

  const handleShare = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare(id);
  };

  const getCardStyle = (index: number) => {
    if (index === 0) {
      // Front card - no rotation, full opacity
      return {
        transform: [{ rotate: '0deg' }],
        zIndex: ideas.length,
        opacity: 1,
        top: 0,
      };
    } else if (index === 1) {
      // Second card - slight right rotation
      return {
        transform: [{ rotate: '2deg' }],
        zIndex: ideas.length - 1,
        opacity: 0.95,
        top: -8,
      };
    } else if (index === 2) {
      // Third card - slight left rotation
      return {
        transform: [{ rotate: '-2deg' }],
        zIndex: ideas.length - 2,
        opacity: 0.9,
        top: -16,
      };
    } else {
      // Hidden cards
      return {
        transform: [{ rotate: index % 2 === 0 ? '-3deg' : '3deg' }],
        zIndex: ideas.length - index,
        opacity: 0.85,
        top: -24,
      };
    }
  };

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case '$': return '#10B981';
      case '$$': return '#F59E0B';
      case '$$$': return '#EF4444';
      default: return Colors.textSecondary;
    }
  };

  const getMatchReasonColor = (ideaId: string) => {
    const hash = ideaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return matchReasonColors[hash % matchReasonColors.length];
  };

  const getIconColor = (index: number) => {
    return iconColors[index % iconColors.length];
  };

  // Placeholder images for date ideas
  const getPlaceholderImage = (ideaId: string) => {
    const images = [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
      'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800',
    ];
    const hash = ideaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  };

  // Get visible cards
  const visibleIdeas = React.useMemo(() => [
    ideas[currentIndex % ideas.length],
    ideas[(currentIndex + 1) % ideas.length],
    ideas[(currentIndex + 2) % ideas.length],
    ideas[(currentIndex + 3) % ideas.length],
  ], [currentIndex, ideas]);

  // Rotation based on swipe
  const cardRotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  // Opacity for card being swiped
  const cardOpacity = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0.5, 1, 0.5],
  });

  return (
    <View style={styles.stackContainer}>
      {visibleIdeas.slice(0, 4).reverse().map((idea, reverseIndex) => {
        const index = visibleIdeas.slice(0, 4).length - 1 - reverseIndex;
        const cardStyle = getCardStyle(index);
        const isTopCard = index === 0;
        const matchColors = getMatchReasonColor(idea.id);
        const isSaved = savedIdeas.has(idea.id);
        
        const animatedStyle = isTopCard ? {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: cardRotate },
          ],
          opacity: cardOpacity,
        } : {};

        return (
          <Animated.View
            key={`${idea.id}-${index}`}
            style={[styles.card, cardStyle, animatedStyle]}
            {...(isTopCard ? panResponder.panHandlers : {})}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={() => handlePress(idea.id)}
              activeOpacity={0.95}
              disabled={!isTopCard}
            >
              {/* Image Section with Placeholder */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: getPlaceholderImage(idea.id) }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.gradient}
                />
              
                {/* Action Buttons - Only on front card */}
                {isTopCard && (
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, isSaved && styles.actionButtonSaved]} 
                      onPress={() => handleSave(idea.id)} 
                      activeOpacity={0.7}
                    >
                      <Heart 
                        size={18} 
                        color={isSaved ? Colors.textWhite : Colors.text} 
                        variant={isSaved ? "Bold" : "Outline"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => handleShare(idea.id)} 
                      activeOpacity={0.7}
                    >
                      <Share size={18} color={Colors.text} variant="Outline" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Category Badge with Gradient */}
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryBadge}
                >
                  <Text style={styles.categoryText}>{idea.category}</Text>
                </LinearGradient>
              </View>

              {/* Content Section */}
              <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{idea.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{idea.description}</Text>

                {/* Match Reason with Colorful Background */}
                {idea.matchReason && isTopCard && (
                  <View style={[
                    styles.matchReason,
                    { 
                      backgroundColor: matchColors.bg,
                      borderWidth: 1,
                      borderColor: matchColors.border,
                    }
                  ]}>
                    <Text style={styles.matchReasonIcon}>✨</Text>
                    <Text style={styles.matchReasonText} numberOfLines={1}>
                      {idea.matchReason}
                    </Text>
                  </View>
                )}

              {/* Info Row */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Clock size={12} color={Colors.textSecondary} variant="Outline" />
                  <Text style={styles.infoText}>{idea.duration}</Text>
                </View>
                <View style={styles.infoItem}>
                  <DollarCircle size={12} color={getBudgetColor(idea.budget)} variant="Bold" />
                  <Text style={[styles.infoText, { color: getBudgetColor(idea.budget) }]}>{idea.budget}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Location size={12} color={Colors.textSecondary} variant="Outline" />
                  <Text style={styles.infoText}>{idea.isIndoor ? 'Indoor' : 'Outdoor'}</Text>
                </View>
              </View>

                {/* CTA Button - Only on front card */}
                {isTopCard && (
                  <TouchableOpacity style={styles.ctaButton} onPress={() => handlePress(idea.id)} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[Colors.gradientStart, Colors.gradientEnd]}
                      style={styles.ctaGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.ctaText}>Plan This Date</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stackContainer: {
    height: 520,
    position: 'relative',
    marginBottom: 0,
    marginTop: Spacing.md,
  },
  card: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTouchable: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    backgroundColor: Colors.backgroundGray,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  actions: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonSaved: {
    backgroundColor: Colors.gradientStart,
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  content: {
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  matchReason: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  matchReasonIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  matchReasonText: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  ctaButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
