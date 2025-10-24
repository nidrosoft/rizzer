/**
 * InvestigationList Component for Gifts feature
 * Displays a scrollable list of investigations
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Investigation } from '@/types/gifts';
import InvestigationCard from './InvestigationCard';

interface InvestigationListProps {
  investigations: Investigation[];
  onInvestigationPress: (id: string) => void;
}

export default function InvestigationList({ 
  investigations, 
  onInvestigationPress 
}: InvestigationListProps) {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {investigations.map((investigation) => (
        <InvestigationCard
          key={investigation.id}
          investigation={investigation}
          onPress={onInvestigationPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
});
