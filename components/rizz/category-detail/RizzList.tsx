/**
 * Rizz List Component
 * Scrollable list of rizz cards with loading states
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RizzCard from './RizzCard';
import RizzLoadingCard from '@/components/rizz/RizzLoadingCard';
import { Spacing } from '@/constants/theme';

interface RizzListProps {
  rizzes: string[];
  savedRizzes: Set<number>;
  isGenerating: boolean;
  onSave: (text: string, index: number) => void;
  onCopy: (text: string) => void;
}

export default function RizzList({
  rizzes,
  savedRizzes,
  isGenerating,
  onSave,
  onCopy,
}: RizzListProps) {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {isGenerating && (
        <>
          <RizzLoadingCard />
          <RizzLoadingCard />
          <RizzLoadingCard />
        </>
      )}
      
      {rizzes.map((rizz, index) => (
        <RizzCard
          key={index}
          text={rizz}
          isSaved={savedRizzes.has(index)}
          onSave={() => onSave(rizz, index)}
          onCopy={() => onCopy(rizz)}
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
    padding: Spacing.lg,
    paddingBottom: 100,
  },
});
