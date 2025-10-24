import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Discover } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function DiscoverySettings() {
  return (
    <PlaceholderPage
      title="Discovery & Events"
      icon={<Discover size={40} color={Colors.purple} variant="Bold" />}
      description="Customize your discovery preferences, event notifications, and location settings."
    />
  );
}
