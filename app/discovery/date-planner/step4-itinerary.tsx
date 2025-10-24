/**
 * AI Date Planner - Step 4: Generated Itinerary
 * Display the AI-generated date plan with timeline and details
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Clock, Location, DollarCircle, InfoCircle, Routing2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { getMockItinerary } from '@/data/mockDateItineraries';
import { ItineraryActivity } from '@/types/datePlanner';

export default function Step4Itinerary() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const itinerary = getMockItinerary();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [shineAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Shining animation for match card gradient
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: '/discovery/date-planner/step5-save',
      params: {
        ...params,
        itineraryId: itinerary.id,
      },
    });
  };

  const toggleActivity = (activityId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const getCategoryColor = (category: ItineraryActivity['category']) => {
    switch (category) {
      case 'food': return '#FF6B6B';
      case 'activity': return '#4ECDC4';
      case 'entertainment': return '#A78BFA';
      case 'relaxation': return '#FCA5A5';
      default: return Colors.purple;
    }
  };

  const getCategoryIcon = (category: ItineraryActivity['category']) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'activity': return '🎯';
      case 'entertainment': return '🎭';
      case 'relaxation': return '💆';
      default: return '✨';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <View style={styles.backCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </View>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Date Plan</Text>
          <Text style={styles.headerSubtitle}>Step 4 of 5</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={[styles.progressFill, { width: '80%' }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Match Score */}
        <View style={styles.matchCardContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.matchCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Animated.View 
              style={[
                styles.shineOverlay,
                {
                  opacity: shineAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.3, 0],
                  }),
                  transform: [{
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 400],
                    }),
                  }],
                },
              ]}
            />
            <View style={styles.matchHeader}>
              <Text style={styles.matchScore}>{itinerary.matchScore}%</Text>
              <Text style={styles.matchLabel}>Match Score</Text>
            </View>
            <Text style={styles.matchReason}>{itinerary.matchReason}</Text>
          </LinearGradient>
        </View>

        {/* Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>{itinerary.title}</Text>
          <View style={styles.overviewStats}>
            <View style={styles.stat}>
              <Clock size={18} color="#FE3C72" variant="Bold" />
              <Text style={styles.statText}>{itinerary.totalDuration}</Text>
            </View>
            <View style={styles.stat}>
              <DollarCircle size={18} color="#3B82F6" variant="Bold" />
              <Text style={styles.statText}>{itinerary.totalCost}</Text>
            </View>
            <View style={styles.stat}>
              <Routing2 size={18} color="#10B981" variant="Bold" />
              <Text style={styles.statText}>2.5 miles</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Your Itinerary</Text>
          {itinerary.activities.map((activity, index) => (
            <View key={activity.id} style={styles.activityContainer}>
              {/* Timeline Line */}
              {index < itinerary.activities.length - 1 && (
                <View style={styles.timelineLine} />
              )}

              {/* Activity Card */}
              <TouchableOpacity
                style={styles.activityCard}
                onPress={() => toggleActivity(activity.id)}
                activeOpacity={0.9}
              >
                {/* Time Badge */}
                <View style={[styles.timeBadge, { backgroundColor: getCategoryColor(activity.category) }]}>
                  <Text style={styles.timeBadgeText}>{activity.time}</Text>
                </View>

                {/* Image */}
                <Image
                  source={{ uri: activity.image }}
                  style={styles.activityImage}
                  resizeMode="cover"
                />

                {/* Content */}
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.categoryBadge}>
                      {getCategoryIcon(activity.category)} {activity.category}
                    </Text>
                    {activity.reservationRequired && (
                      <View style={styles.reservationBadge}>
                        <Text style={styles.reservationText}>Reservation</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>

                  <View style={styles.activityMeta}>
                    <View style={styles.metaItem}>
                      <Location size={14} color="#10B981" variant="Bold" />
                      <Text style={styles.metaText}>{activity.location}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#FE3C72" variant="Bold" />
                      <Text style={styles.metaText}>{activity.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarCircle size={14} color="#3B82F6" variant="Bold" />
                      <Text style={styles.metaText}>{activity.estimatedCost}</Text>
                    </View>
                  </View>

                  {/* Expanded Tips */}
                  {expandedActivity === activity.id && activity.tips && (
                    <View style={styles.tipsContainer}>
                      <View style={styles.tipsHeader}>
                        <InfoCircle size={16} color={Colors.purple} variant="Bold" />
                        <Text style={styles.tipsTitle}>Insider Tips</Text>
                      </View>
                      {activity.tips.map((tip, tipIndex) => (
                        <View key={tipIndex} style={styles.tipRow}>
                          <Text style={styles.tipBullet}>•</Text>
                          <Text style={styles.tipText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.saveText}>Save & Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  matchCardContainer: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  matchCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ skewX: '-20deg' }],
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  matchScore: {
    fontSize: 48,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  matchLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  matchReason: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    lineHeight: 22,
    opacity: 0.95,
  },
  overviewCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  overviewStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  timelineSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  activityContainer: {
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 40,
    bottom: -Spacing.xl,
    width: 2,
    backgroundColor: Colors.borderLight,
  },
  activityCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timeBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    zIndex: 1,
  },
  timeBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  activityImage: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.backgroundGray,
  },
  activityContent: {
    padding: Spacing.lg,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  reservationBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  reservationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: '#DC2626',
  },
  activityTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  activityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  tipsContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tipsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  tipBullet: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
