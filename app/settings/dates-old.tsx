import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Calendar } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function DatesSettings() {
  return (
    <PlaceholderPage
      title="Dates Management"
      icon={<Calendar size={40} color={Colors.purple} variant="Bold" />}
      description="Manage your date profiles, reminders, and date planning preferences."
    />
  );
}
