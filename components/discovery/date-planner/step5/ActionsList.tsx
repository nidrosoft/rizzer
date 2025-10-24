/**
 * Actions List Component
 * List of action cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActionCard from './ActionCard';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface Action {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  action: () => void;
}

interface ActionsListProps {
  actions: Action[];
  completedActions: string[];
}

export default function ActionsList({ actions, completedActions }: ActionsListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to do?</Text>
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          icon={action.icon}
          title={action.title}
          description={action.description}
          color={action.color}
          isCompleted={completedActions.includes(action.id)}
          onPress={action.action}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
});
