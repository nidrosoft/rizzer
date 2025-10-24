import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { InfoCircle } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function AboutSettings() {
  return (
    <PlaceholderPage
      title="About App"
      icon={<InfoCircle size={40} color={Colors.purple} variant="Bold" />}
      description="Learn more about Rizzers, version information, and what's new."
    />
  );
}
