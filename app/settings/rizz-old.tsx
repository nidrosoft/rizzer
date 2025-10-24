import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Flash } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function RizzSettings() {
  return (
    <PlaceholderPage
      title="Rizz Settings"
      icon={<Flash size={40} color={Colors.purple} variant="Bold" />}
      description="Customize your rizz lines, conversation starters, and AI assistant preferences."
    />
  );
}
