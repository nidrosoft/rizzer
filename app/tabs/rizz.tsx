/**
 * Rizz Screen - Refactored with Modular Architecture
 * My Rizz categories and Genius Rizz chat threads
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { RizzTab } from '@/types/rizz';

// Modular Components
import RizzHeader from '@/components/rizz/RizzHeader';
import RizzTabs from '@/components/rizz/RizzTabs';
import RizzCategoriesGrid from '@/components/rizz/RizzCategoriesGrid';
import ChatThreadList from '@/components/rizz/ChatThreadList';
import PlusButton from '@/components/ui/PlusButton';
import CreateRizzIntroModal from '@/components/rizz/CreateRizzIntroModal';
import CreateRizzBottomSheet, { RizzCategoryData } from '@/components/rizz/CreateRizzBottomSheet';
import { useToast } from '@/contexts/ToastContext';

// Mock Data
import { getRizzCategories, getChatThreads, groupChatsByDate } from '@/data/mockRizz';

export default function RizzScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<RizzTab>('myRizz');
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // Handlers
  const handleTabChange = (tab: RizzTab) => {
    setActiveTab(tab);
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push('/rizz/category-detail');
  };

  const handleChatPress = (chatId: string) => {
    router.push('/genius-chat');
  };

  const handleAddRizz = () => {
    // Navigate to genius chat if on Genius Rizz tab
    if (activeTab === 'geniusRizz') {
      router.push('/genius-chat');
    } else {
      // Show intro modal for creating custom Rizz
      setShowIntroModal(true);
    }
  };

  const handleContinueToCreate = () => {
    setShowIntroModal(false);
    // Small delay for smooth transition
    setTimeout(() => {
      setShowCreateSheet(true);
    }, 300);
  };

  const handleCreateRizz = (data: RizzCategoryData) => {
    setShowCreateSheet(false);
    // TODO: Save to backend/state
    console.log('Created Rizz:', data);
    showToast(`"${data.name}" created successfully!`, 'success');
  };

  const chatGroups = groupChatsByDate(getChatThreads());

  return (
    <View style={styles.container}>
      {/* Header + Tabs with Gradient (extends to status bar) */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={['top']}>
          <RizzHeader title="Rizz ⚡" />
          <RizzTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      {activeTab === 'myRizz' ? (
        // My Rizz - Categories Grid
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <RizzCategoriesGrid
            categories={getRizzCategories()}
            onCategoryPress={handleCategoryPress}
          />
        </ScrollView>
      ) : (
        // Genius Rizz - Chat Threads
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ChatThreadList
            chatGroups={chatGroups}
            onChatPress={handleChatPress}
          />
        </ScrollView>
      )}

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAddRizz} />

      {/* Create Rizz Modals */}
      <CreateRizzIntroModal
        visible={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onContinue={handleContinueToCreate}
      />
      
      <CreateRizzBottomSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreate={handleCreateRizz}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientHeader: {
    // No additional styles needed, gradient handles it
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
});
