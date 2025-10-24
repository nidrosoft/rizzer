import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { MessageQuestion } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function HelpSettings() {
  return (
    <PlaceholderPage
      title="Help & Support"
      icon={<MessageQuestion size={40} color={Colors.purple} variant="Bold" />}
      description="Get help, contact support, view FAQs, and access tutorials."
    />
  );
}
