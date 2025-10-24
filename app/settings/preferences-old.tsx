import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Setting2 } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function AppPreferences() {
  return (
    <PlaceholderPage
      title="App Preferences"
      icon={<Setting2 size={40} color={Colors.purple} variant="Bold" />}
      description="Customize your app experience with personalized preferences and settings."
    />
  );
}
