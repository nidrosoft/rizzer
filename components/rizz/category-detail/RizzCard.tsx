/**
 * Rizz Card Component
 * Individual rizz line card with save and copy actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Copy, Star1 } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface RizzCardProps {
  text: string;
  isSaved: boolean;
  confidenceScore?: number;
  onSave: () => void;
  onCopy: () => void;
}

export default function RizzCard({ text, isSaved, confidenceScore, onSave, onCopy }: RizzCardProps) {
  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSave();
  };

  const handleCopy = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCopy();
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
        {confidenceScore !== undefined && (
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{confidenceScore}%</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSave}
          activeOpacity={0.6}
        >
          {isSaved ? (
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.savedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Star1 size={22} color={Colors.textWhite} variant="Bold" />
            </LinearGradient>
          ) : (
            <Star1 size={22} color={Colors.text} variant="Outline" />
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleCopy}
          activeOpacity={0.6}
        >
          <Copy size={22} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
  },
  text: {
    fontSize: normalize(16),
    color: Colors.text,
    lineHeight: normalize(22),
    marginBottom: Spacing.xs,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  confidenceText: {
    fontSize: normalize(11),
    fontWeight: '600',
    color: Colors.textWhite,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  savedGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
