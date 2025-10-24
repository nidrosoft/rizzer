/**
 * ContactCard Component for Gifts feature
 * Displays individual contact in selection list
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TickCircle, User } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ContactCardProps } from '@/types/gifts';

export default function ContactCard({ contact, isSelected, onPress }: ContactCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(contact);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
        {contact.avatar ? (
          <Text style={styles.avatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
        ) : (
          <User size={24} color={isSelected ? Colors.purple : Colors.textSecondary} variant="Bold" />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {contact.name}
          </Text>
          {contact.isAppUser && (
            <View style={styles.appUserBadge}>
              <Text style={styles.appUserText}>App User</Text>
            </View>
          )}
        </View>
        {contact.phone && (
          <Text style={styles.phone} numberOfLines={1}>
            {contact.phone}
          </Text>
        )}
      </View>

      {/* Selection Indicator */}
      {isSelected && (
        <View style={styles.checkmark}>
          <TickCircle size={24} color={Colors.purple} variant="Bold" />
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
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.purple,
    borderWidth: 2,
    backgroundColor: `${Colors.purple}05`,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarSelected: {
    backgroundColor: `${Colors.purple}15`,
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    flex: 1,
  },
  appUserBadge: {
    backgroundColor: Colors.text,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  appUserText: {
    fontSize: 10,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  phone: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  checkmark: {
    marginLeft: Spacing.sm,
  },
});
