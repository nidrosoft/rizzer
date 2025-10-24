import React from 'react';
import PlaceholderPage from '@/components/settings/PlaceholderPage';
import { DocumentText } from 'iconsax-react-native';
import { Colors } from '@/constants/theme';

export default function TermsSettings() {
  return (
    <PlaceholderPage
      title="Terms & Conditions"
      icon={<DocumentText size={40} color={Colors.purple} variant="Bold" />}
      description="Read our terms of service, privacy policy, and user agreements."
    />
  );
}
