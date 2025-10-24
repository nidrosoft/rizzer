/**
 * Mock contact data for Gifts feature
 * Simulates phone contacts and app users
 */

import { Contact } from '@/types/gifts';

export const mockContacts: Contact[] = [
  // Phone Contacts
  {
    id: 'c1',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c2',
    name: 'Mike Chen',
    phone: '+1 (555) 234-5678',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c3',
    name: 'Emma Davis',
    phone: '+1 (555) 345-6789',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c4',
    name: 'Alex Thompson',
    phone: '+1 (555) 456-7890',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c5',
    name: 'Jessica Lee',
    phone: '+1 (555) 567-8901',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c6',
    name: 'David Park',
    phone: '+1 (555) 678-9012',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c7',
    name: 'Rachel Green',
    phone: '+1 (555) 789-0123',
    source: 'phone',
    isAppUser: false,
  },
  {
    id: 'c8',
    name: 'Tom Wilson',
    phone: '+1 (555) 890-1234',
    source: 'phone',
    isAppUser: false,
  },
  
  // App Users
  {
    id: 'c9',
    name: 'Olivia Martinez',
    phone: '+1 (555) 901-2345',
    source: 'app',
    isAppUser: true,
  },
  {
    id: 'c10',
    name: 'James Anderson',
    phone: '+1 (555) 012-3456',
    source: 'app',
    isAppUser: true,
  },
  {
    id: 'c11',
    name: 'Sophia Taylor',
    phone: '+1 (555) 123-4560',
    source: 'app',
    isAppUser: true,
  },
  {
    id: 'c12',
    name: 'Daniel Brown',
    phone: '+1 (555) 234-5601',
    source: 'app',
    isAppUser: true,
  },
];

/**
 * Filter contacts by source
 */
export const getContactsBySource = (contacts: Contact[], source: 'phone' | 'app' | 'all'): Contact[] => {
  if (source === 'all') return contacts;
  return contacts.filter(contact => contact.source === source);
};

/**
 * Search contacts by name
 */
export const searchContacts = (contacts: Contact[], query: string): Contact[] => {
  if (!query.trim()) return contacts;
  
  const lowerQuery = query.toLowerCase();
  return contacts.filter(contact => 
    contact.name.toLowerCase().includes(lowerQuery) ||
    contact.phone?.includes(query)
  );
};
