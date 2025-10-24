import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Gift } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function GiftsSettings() {
  return (
    <PlaceholderPage
      title="Gift Investigations"
      icon={<Gift size={40} color={Colors.purple} variant="Bold" />}
      description="Configure gift investigation settings, budget preferences, and AI suggestions."
    />
  );
}
