/**
 * ContactList Component for Gifts feature
 * Displays scrollable list of contacts with search and filtering
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Contact, ContactSource } from '@/types/gifts';
import { GiftsConfig } from '@/constants/gifts';
import { searchContacts, getContactsBySource } from '@/data/mockContacts';
import SearchBar from '@/components/ui/SearchBar';
import SectionHeader from '@/components/ui/SectionHeader';
import ContactCard from './ContactCard';
import SourceToggle from './SourceToggle';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
}

export default function ContactList({ contacts, selectedContact, onContactSelect }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<ContactSource | 'all'>('all');

  // Filter and search contacts
  const filteredBySource = getContactsBySource(contacts, activeSource);
  const filteredContacts = searchContacts(filteredBySource, searchQuery);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={GiftsConfig.placeholders.search}
        />
      </View>

      {/* Source Toggle */}
      <View style={styles.toggleContainer}>
        <SourceToggle activeSource={activeSource} onSourceChange={setActiveSource} />
      </View>

      {/* Section Header */}
      <View style={styles.headerContainer}>
        <SectionHeader
          title="Select Contact"
          subtitle={`${filteredContacts.length} contact${filteredContacts.length !== 1 ? 's' : ''}`}
        />
      </View>

      {/* Contact List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isSelected={selectedContact?.id === contact.id}
            onPress={onContactSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  toggleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
