/**
 * TodaysAgenda Component
 * Displays today's tasks and reminders
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Calendar, Call, Gift } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';

interface AgendaItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function TodaysAgenda() {
  const { showToast } = useToast();

  const items: AgendaItem[] = [
    {
      id: '1',
      title: 'Dinner with Sarah - 7:00 PM',
      icon: <Calendar size={20} color={Colors.textWhite} variant="Bold" />,
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: '2',
      title: 'Call Emma about weekend plans',
      icon: <Call size={20} color={Colors.textWhite} variant="Bold" />,
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: '3',
      title: 'Update gift ideas for birthday',
      icon: <Gift size={20} color={Colors.textWhite} variant="Bold" />,
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
  ];

  const handleAgendaPress = (item: AgendaItem) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    showToast(`Reminder set for: ${item.title}`, 'success');
  };

  return (
    <View style={styles.section}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Today's Agenda</Text>
        <View style={styles.itemsList}>
          {items.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.agendaItem}
              onPress={() => handleAgendaPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  card: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    marginBottom: Spacing.md,
  },
  itemsList: {
    gap: Spacing.md,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    fontWeight: FontWeights.medium,
  },
});
