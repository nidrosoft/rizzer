/**
 * Profile Info Card Component
 * Card displaying account information with edit button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Sms, Call, Location, Edit2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface ProfileInfoCardProps {
  data: ProfileData;
  onEdit: () => void;
}

export default function ProfileInfoCard({ data, onEdit }: ProfileInfoCardProps) {
  const infoItems = [
    { icon: User, label: 'Full Name', value: data.fullName },
    { icon: Sms, label: 'Email', value: data.email },
    { icon: Call, label: 'Phone', value: data.phone },
    { icon: Location, label: 'Location', value: data.location },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Edit2 size={20} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={index}>
              <View style={styles.item}>
                <View style={styles.left}>
                  <Icon size={22} color={Colors.text} variant="Outline" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                </View>
              </View>
              {index < infoItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  item: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  value: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg,
  },
});
