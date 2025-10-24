import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { MessageText1 } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function AIChatSettings() {
  return (
    <PlaceholderPage
      title="AI Chat History"
      icon={<MessageText1 size={40} color={Colors.purple} variant="Bold" />}
      description="View and manage your AI chat history, export conversations, and clear data."
    />
  );
}
