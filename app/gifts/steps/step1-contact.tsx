/**
 * Step 1: Contact Selection
 * First step in the new investigation flow
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Contact } from '@/types/gifts';
import { mockContacts } from '@/data/mockContacts';
import StepLayout from '@/components/gifts/StepLayout';
import ContactList from '@/components/gifts/ContactList';
import ContinueButton from '@/components/gifts/ContinueButton';

export default function Step1ContactScreen() {
  const router = useRouter();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleContinue = () => {
    if (!selectedContact) return;
    
    // Navigate to Step 2 with contact data
    router.push({
      pathname: '/gifts/steps/step2-occasion',
      params: {
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        contactPhone: selectedContact.phone || '',
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StepLayout
      title="New Investigation"
      currentStep={0}
      totalSteps={5}
      stepTitle="Select Contact"
      onBack={handleBack}
    >
      <View style={styles.container}>
        {/* Contact List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ContactList
            contacts={mockContacts}
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
          />
        </ScrollView>

        {/* Continue Button */}
        {selectedContact && (
          <ContinueButton onPress={handleContinue} />
        )}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});
