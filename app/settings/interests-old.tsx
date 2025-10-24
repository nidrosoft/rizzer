import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Heart } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function InterestsSettings() {
  return (
    <PlaceholderPage
      title="Interests & Hobbies"
      icon={<Heart size={40} color={Colors.purple} variant="Bold" />}
      description="Update your interests and hobbies to get better matches and recommendations."
    />
  );
}
