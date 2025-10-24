import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { Star1 } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function FeedbackSettings() {
  return (
    <PlaceholderPage
      title="Rate & Feedback"
      icon={<Star1 size={40} color={Colors.purple} variant="Bold" />}
      description="Rate our app, share your feedback, and help us improve your experience."
    />
  );
}
