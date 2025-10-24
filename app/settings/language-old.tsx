import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Global } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function LanguageSettings() {
  return (
    <PlaceholderPage
      title="Language"
      icon={<Global size={40} color={Colors.purple} variant="Bold" />}
      description="Choose your preferred language for the app interface and content."
    />
  );
}
