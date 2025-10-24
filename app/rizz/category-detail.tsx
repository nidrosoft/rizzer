/**
 * Rizz Category Detail Screen - Refactored
 * Clean orchestration of category detail components
 */

import React, { useState } from 'react';
import { View, StyleSheet, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import {
  CategoryHeader,
  RizzList,
  RegenerateFAB,
  CategoryActionSheet,
  DeleteModal,
} from '@/components/rizz/category-detail';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedRizzes, setSavedRizzes] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - will be replaced with actual data based on category
  const categoryData = {
    title: 'Conversation Starters',
    description: 'My favorite collections of categories on asking her out in a funny way.',
    color: '#FF6B9D',
    icon: '😊',
    rizzes: [
      'My favorite collections of categories on Asking her out in a funny way.',
      'Are you a magician? Because whenever I look at you, everyone else disappears.',
      'Do you believe in love at first sight, or should I walk by again?',
      'If you were a vegetable, you\'d be a cute-cumber!',
      'Is your name Google? Because you have everything I\'ve been searching for.',
      'Do you have a map? I keep getting lost in your eyes.',
      'I was reading the book of Numbers last night, and I realized I don\'t have yours. Would you mind if we changed that? I promise I\'m not just trying to add you to my collection - you seem genuinely interesting.',
      'Excuse me, but I think you dropped something: my jaw.',
      'I\'m not a photographer, but I can definitely picture us together. And honestly, I think we\'d make a pretty amazing team. What do you think about grabbing coffee sometime and seeing if this chemistry is real or if I\'m just being optimistic?',
      'Are you French? Because Eiffel for you.',
      'If being beautiful was a crime, you\'d be serving a life sentence without parole. I\'d be your lawyer, but I don\'t think I could defend you - the evidence is just too overwhelming.',
      'Do you have a Band-Aid? Because I just scraped my knee falling for you, and I think I might need some medical attention. Or at least your phone number so we can discuss treatment options over dinner.',
    ],
  };

  const handleBack = () => {
    router.back();
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    setToastMessage('Copied to clipboard!');
    setToastType('info');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSave = (text: string, index: number) => {
    setSavedRizzes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
        setToastMessage('Removed from collection!');
      } else {
        newSet.add(index);
        setToastMessage('Saved to collection!');
      }
      return newSet;
    });
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      // TODO: Add new rizzes to the list
    }, 3000);
  };

  const handleMoreOptions = () => {
    setShowActionSheet(true);
  };

  const handleAddToHome = () => {
    setShowActionSheet(false);
    // TODO: Add to home quick actions
    setToastMessage('Added to Home Quick Actions!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDeletePress = () => {
    setShowActionSheet(false);
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    // TODO: Delete category
    setToastMessage('Category deleted successfully');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#E6E9EB', '#FFFFFF']}
      style={styles.container}
      locations={[0, 1]}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <CategoryHeader
          title={categoryData.title}
          description={categoryData.description}
          onBack={handleBack}
          onMoreOptions={handleMoreOptions}
        />

        <RizzList
          rizzes={categoryData.rizzes}
          savedRizzes={savedRizzes}
          isGenerating={isGenerating}
          onSave={handleSave}
          onCopy={handleCopy}
        />

        <RegenerateFAB onPress={handleRegenerate} />

        <CategoryActionSheet
          visible={showActionSheet}
          onClose={() => setShowActionSheet(false)}
          onAddToHome={handleAddToHome}
          onDelete={handleDeletePress}
        />

        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />

        <Toast 
          visible={showToast} 
          message={toastMessage} 
          type={toastType} 
          onHide={() => setShowToast(false)} 
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
