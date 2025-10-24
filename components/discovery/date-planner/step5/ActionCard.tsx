/**
 * Action Card Component
 * Individual action card with icon, title, description, and completion state
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { TickCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface ActionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  isCompleted: boolean;
  onPress: () => void;
}

export default function ActionCard({
  icon: Icon,
  title,
  description,
  color,
  isCompleted,
  onPress,
}: ActionCardProps) {
  const handlePress = () => {
    if (!isCompleted) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isCompleted}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon 
          size={24} 
          color={isCompleted ? Colors.textSecondary : color} 
          variant="Bold" 
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {isCompleted ? (
        <TickCircle size={28} color="#10B981" variant="Bold" />
      ) : (
        <View style={styles.arrow}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" 
              stroke={Colors.textSecondary} 
              strokeWidth="1.5" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompleted: {
    borderColor: Colors.borderLight,
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  description: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  arrow: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
