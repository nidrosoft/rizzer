/**
 * ActiveDatesSection Component
 * Quick date planning with smart suggestions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Calendar, Clock, Location, Heart } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { CurrentDatesSectionProps } from '@/types/home';

export default function ActiveDatesSection({ onCreateDate }: CurrentDatesSectionProps) {
  const handleCreateDate = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onCreateDate();
  };

  const handleQuickAction = (action: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Quick action:', action);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Current Dates</Text>
        <TouchableOpacity onPress={handleCreateDate} activeOpacity={0.7}>
          <Text style={styles.planNew}>Plan New</Text>
        </TouchableOpacity>
      </View>
      
      {/* Quick Date Ideas */}
      <View style={styles.quickIdeas}>
        <TouchableOpacity 
          style={styles.ideaCard} 
          onPress={() => handleQuickAction('tonight')}
          activeOpacity={0.8}
        >
          <View style={[styles.ideaIcon, { backgroundColor: 'rgba(255, 107, 157, 0.15)' }]}>
            <Heart size={20} color="#FF6B9D" variant="Bold" />
          </View>
          <View style={styles.ideaContent}>
            <Text style={styles.ideaTitle}>Tonight</Text>
            <Text style={styles.ideaSubtitle}>Dinner at 7 PM</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.ideaCard} 
          onPress={() => handleQuickAction('weekend')}
          activeOpacity={0.8}
        >
          <View style={[styles.ideaIcon, { backgroundColor: 'rgba(171, 71, 188, 0.15)' }]}>
            <Calendar size={20} color="#AB47BC" variant="Bold" />
          </View>
          <View style={styles.ideaContent}>
            <Text style={styles.ideaTitle}>This Weekend</Text>
            <Text style={styles.ideaSubtitle}>Brunch & Walk</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Date Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(38, 198, 218, 0.15)' }]}>
            <Clock size={16} color="#26C6DA" variant="Bold" />
          </View>
          <Text style={styles.statLabel}>Next: Tomorrow</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 167, 38, 0.15)' }]}>
            <Location size={16} color="#FFA726" variant="Bold" />
          </View>
          <Text style={styles.statLabel}>3 spots saved</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  planNew: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  quickIdeas: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  ideaCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ideaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  ideaContent: {
    flex: 1,
  },
  ideaTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  ideaSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
    flex: 1,
  },
});
