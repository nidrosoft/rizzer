/**
 * Rizz List Component
 * Scrollable list of rizz cards with loading states
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RizzCard from './RizzCard';
import RizzLoadingCard from '@/components/rizz/RizzLoadingCard';
import { Spacing } from '@/constants/theme';

interface RizzLine {
  id: string;
  content: string;
  is_saved?: boolean;
  confidence_score?: number;
  tags?: string[];
  tone?: string;
}

interface RizzListProps {
  rizzes: string[];
  rizzLines?: RizzLine[];
  savedRizzIds?: Set<string>;
  isGenerating: boolean;
  onSave: (lineId: string) => void;
  onCopy: (text: string, lineId: string) => void;
}

export default function RizzList({
  rizzes,
  rizzLines = [],
  savedRizzIds = new Set(),
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
      
      {rizzLines.length > 0 ? (
        rizzLines.map((line) => (
          <RizzCard
            key={line.id}
            text={line.content}
            isSaved={savedRizzIds.has(line.id)}
            confidenceScore={line.confidence_score || undefined}
            onSave={() => onSave(line.id)}
            onCopy={() => onCopy(line.content, line.id)}
          />
        ))
      ) : (
        !isGenerating && rizzes.map((rizz, index) => (
          <RizzCard
            key={index}
            text={rizz}
            isSaved={false}
            onSave={() => {}}
            onCopy={() => onCopy(rizz, `temp-${index}`)}
          />
        ))
      )}
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
