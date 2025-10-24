/**
 * Investigation Detail Screen
 * Shows live chat view and summary with tabbed interface
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Edit2, Trash, Pause, Play } from 'iconsax-react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { InvestigationTab, Message, InvestigationStatus } from '@/types/gifts';
import GradientHeader from '@/components/ui/GradientHeader';
import TabSwitch from '@/components/ui/TabSwitch';
import StatusBadge from '@/components/gifts/StatusBadge';
import MessageList from '@/components/gifts/MessageList';
import MessageInput from '@/components/gifts/MessageInput';
import ConversationSummary from '@/components/gifts/ConversationSummary';
import PauseButton from '@/components/gifts/PauseButton';
import GiftSuggestionCard from '@/components/gifts/GiftSuggestionCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { getMessagesByInvestigationId, getConversationSummary, getConversationInsights } from '@/data/mockMessages';
import { getGiftSuggestions } from '@/data/mockGiftSuggestions';

export default function InvestigationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { investigationId, recipientName, status: initialStatus } = params as { 
    investigationId: string;
    recipientName: string;
    status: string;
  };

  const [activeTab, setActiveTab] = useState<InvestigationTab>('chat');
  const [messages, setMessages] = useState<Message[]>(getMessagesByInvestigationId(investigationId));
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [investigationStatus, setInvestigationStatus] = useState<InvestigationStatus>(initialStatus as InvestigationStatus);
  const [isPaused, setIsPaused] = useState(initialStatus === 'paused');

  const summary = getConversationSummary(investigationId);
  const insights = getConversationInsights(investigationId);
  const suggestions = getGiftSuggestions().slice(0, 3); // Show top 3

  const handleBack = () => {
    router.back();
  };

  const handleMorePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleSendMessage = (content: string) => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      isInjected: true,
    };
    
    setMessages([...messages, newMessage]);
    
    // TODO: Send to backend API
    // await sendInjectedMessage(investigationId, content);
  };

  const handlePauseInvestigation = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Pause Investigation',
      'Sherlock will stop chatting with ' + recipientName + '. You can resume anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          style: 'destructive',
          onPress: () => {
            setInvestigationStatus('paused');
            setIsPaused(true);
            setShowActionSheet(false);
            // TODO: Call API to pause investigation
            // await pauseInvestigation(investigationId);
          },
        },
      ]
    );
  };

  const handleResumeInvestigation = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Resume Investigation',
      'Sherlock will continue chatting with ' + recipientName + '.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resume',
          onPress: () => {
            setInvestigationStatus('active');
            setIsPaused(false);
            // TODO: Call API to resume investigation
            // await resumeInvestigation(investigationId);
          },
        },
      ]
    );
  };

  const handleEditContext = () => {
    setShowActionSheet(false);
    // TODO: Navigate to edit screen
    console.log('Edit context');
  };

  const handleDelete = () => {
    setShowActionSheet(false);
    // TODO: Show delete confirmation
    console.log('Delete investigation');
  };

  const handleGiftPress = (suggestion: any) => {
    console.log('Gift selected:', suggestion.title);
    // TODO: Add to wish list or navigate to details
  };

  const handleRegenerateSuggestions = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Regenerate suggestions');
    // TODO: Trigger AI to regenerate suggestions
  };

  const tabs = [
    { key: 'chat', label: 'Live Chat' },
    { key: 'summary', label: 'Summary' },
  ];

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[GiftsConfig.gradient.start, GiftsConfig.gradient.end]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <GradientHeader
          title={recipientName}
          gradientColors={['transparent', 'transparent']}
          showBackButton={true}
          onBackPress={handleBack}
          rightElement={
            <TouchableOpacity
              style={styles.moreButton}
              onPress={handleMorePress}
              activeOpacity={0.6}
            >
              <View style={styles.iconCircle}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <G clipPath="url(#clip0_4418_7499)">
                    <Path d="M5 14.75C3.48 14.75 2.25 13.52 2.25 12C2.25 10.48 3.48 9.25 5 9.25C6.52 9.25 7.75 10.48 7.75 12C7.75 13.52 6.52 14.75 5 14.75ZM5 10.75C4.31 10.75 3.75 11.31 3.75 12C3.75 12.69 4.31 13.25 5 13.25C5.69 13.25 6.25 12.69 6.25 12C6.25 11.31 5.69 10.75 5 10.75Z" fill={Colors.text}/>
                    <Path d="M19 14.75C17.48 14.75 16.25 13.52 16.25 12C16.25 10.48 17.48 9.25 19 9.25C20.52 9.25 21.75 10.48 21.75 12C21.75 13.52 20.52 14.75 19 14.75ZM19 10.75C18.31 10.75 17.75 11.31 17.75 12C17.75 12.69 18.31 13.25 19 13.25C19.69 13.25 20.25 12.69 20.25 12C20.25 11.31 19.69 10.75 19 10.75Z" fill={Colors.text}/>
                    <Path d="M12 14.75C10.48 14.75 9.25 13.52 9.25 12C9.25 10.48 10.48 9.25 12 9.25C13.52 9.25 14.75 10.48 14.75 12C14.75 13.52 13.52 14.75 12 14.75ZM12 10.75C11.31 10.75 10.75 11.31 10.75 12C10.75 12.69 11.31 13.25 12 13.25C12.69 13.25 13.25 12.69 13.25 12C13.25 11.31 12.69 10.75 12 10.75Z" fill={Colors.text}/>
                  </G>
                  <Defs>
                    <ClipPath id="clip0_4418_7499">
                      <Rect width="24" height="24" fill="white"/>
                    </ClipPath>
                  </Defs>
                </Svg>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Status Badge & Controls */}
        <View style={styles.statusContainer}>
          <StatusBadge status={investigationStatus} />
          
          {/* Pause/Resume Button */}
          {(investigationStatus === 'active' || investigationStatus === 'paused') && (
            <TouchableOpacity
              style={styles.pauseResumeButton}
              onPress={isPaused ? handleResumeInvestigation : handlePauseInvestigation}
              activeOpacity={0.7}
            >
              <View style={[styles.pauseResumeCircle, isPaused && styles.resumeCircle]}>
                {isPaused ? (
                  <Play size={18} color={Colors.textWhite} variant="Bold" />
                ) : (
                  <Pause size={18} color={Colors.textWhite} variant="Bold" />
                )}
              </View>
              <Text style={styles.pauseResumeText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabSwitch
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as InvestigationTab)}
            variant="light"
          />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'chat' ? (
          <>
            {/* Chat Messages */}
            <MessageList messages={messages} recipientName={recipientName} />

            {/* Pause Button (Floating) */}
            <View style={styles.pauseButtonContainer}>
              <PauseButton onPress={handlePauseInvestigation} />
            </View>

            {/* Message Input */}
            <MessageInput onSend={handleSendMessage} isPaused={isPaused} />
          </>
        ) : (
          <View style={styles.summaryContainer}>
            <ConversationSummary 
              summary={summary} 
              insights={insights}
              highlights={[
                "I've been really into tennis lately",
                "My old racket is getting worn out",
                "I love trying new outdoor activities"
              ]}
              interests={[
                "Tennis",
                "Outdoor Sports",
                "Fitness",
                "Technology",
                "Reading"
              ]}
              personality={[
                "Active",
                "Adventurous",
                "Health-conscious",
                "Social"
              ]}
            />

            {/* Gift Suggestions */}
            <View style={styles.suggestionsSection}>
              <View style={styles.sectionHeaderContainer}>
                <SectionHeader
                  title="Gift Suggestions"
                  subtitle="Based on the conversation"
                />
              </View>
              
              {suggestions.map((suggestion) => (
                <GiftSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onPress={handleGiftPress}
                />
              ))}

              {/* Regenerate Button */}
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleRegenerateSuggestions}
                activeOpacity={0.7}
              >
                <Text style={styles.regenerateText}>🔄 Regenerate Suggestions</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            
            <Text style={styles.actionSheetTitle}>Investigation Actions</Text>

            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={handlePauseInvestigation}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIcon, { backgroundColor: `${Colors.warning}15` }]}>
                <Pause size={20} color={Colors.warning} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Pause Investigation</Text>
                <Text style={styles.actionSheetOptionSubtext}>Temporarily stop the conversation</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={handleEditContext}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIcon, { backgroundColor: `${Colors.purple}15` }]}>
                <Edit2 size={20} color={Colors.purple} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Edit Context</Text>
                <Text style={styles.actionSheetOptionSubtext}>Update relationship details</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionSheetDivider} />

            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIcon, { backgroundColor: `${Colors.error}15` }]}>
                <Trash size={20} color={Colors.error} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={[styles.actionSheetOptionText, { color: Colors.error }]}>
                  Delete Investigation
                </Text>
                <Text style={styles.actionSheetOptionSubtext}>This action cannot be undone</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: Spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  pauseResumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
  },
  pauseResumeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeCircle: {
    backgroundColor: Colors.success,
  },
  pauseResumeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  pauseButtonContainer: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
  },
  summaryContainer: {
    flex: 1,
  },
  suggestionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionHeaderContainer: {
    marginBottom: Spacing.md,
  },
  regenerateButton: {
    backgroundColor: `${GiftsConfig.gradient.start}10`,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: `${GiftsConfig.gradient.start}30`,
  },
  regenerateText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: GiftsConfig.gradient.start,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionSheetTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  actionSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  actionSheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionSheetTextContainer: {
    flex: 1,
  },
  actionSheetOptionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  actionSheetOptionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionSheetDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
  },
});
