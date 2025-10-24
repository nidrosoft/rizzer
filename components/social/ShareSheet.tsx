/**
 * Share Sheet Component
 * Bottom sheet modal for sharing content
 * MAX 200 lines - Micro-modular component
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ShareContent, shareNative, shareToWhatsApp, shareViaSMS, shareViaEmail, copyToClipboard, shareToInstagram } from '@/utils/enhancedShare';
import SharePreview from './SharePreview';
import ShareMessageInput from './ShareMessageInput';
import ShareOption from './ShareOption';

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  content: ShareContent;
}

export default function ShareSheet({ visible, onClose, content }: ShareSheetProps) {
  const [customMessage, setCustomMessage] = useState('');

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCustomMessage('');
    onClose();
  };

  const getShareMessage = () => {
    return customMessage || content.message;
  };

  const handleInstagram = async () => {
    await shareToInstagram(getShareMessage());
    handleClose();
  };

  const handleWhatsApp = async () => {
    await shareToWhatsApp(getShareMessage());
    handleClose();
  };

  const handleSMS = async () => {
    await shareViaSMS(getShareMessage());
    handleClose();
  };

  const handleEmail = async () => {
    await shareViaEmail(content.title, getShareMessage());
    handleClose();
  };

  const handleCopyLink = async () => {
    const textToCopy = content.url || getShareMessage();
    await copyToClipboard(textToCopy);
    handleClose();
  };

  const handleMore = async () => {
    await shareNative({
      ...content,
      message: getShareMessage(),
    });
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Header */}
          <Text style={styles.title}>Share</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Preview */}
            <SharePreview
              icon={content.image || '📤'}
              title={content.title}
              description={content.message}
            />
            
            {/* Custom Message */}
            <ShareMessageInput
              value={customMessage}
              onChangeText={setCustomMessage}
            />
            
            {/* Share Options */}
            <Text style={styles.sectionTitle}>Share to:</Text>
            <View style={styles.optionsGrid}>
              <ShareOption
                icon="📷"
                label="Instagram"
                color="#E4405F"
                onPress={handleInstagram}
              />
              <ShareOption
                icon="💬"
                label="WhatsApp"
                color="#25D366"
                onPress={handleWhatsApp}
              />
              <ShareOption
                icon="💬"
                label="SMS"
                color="#007AFF"
                onPress={handleSMS}
              />
              <ShareOption
                icon="✉️"
                label="Email"
                color="#EA4335"
                onPress={handleEmail}
              />
              <ShareOption
                icon="📋"
                label="Copy Link"
                color={Colors.purple}
                onPress={handleCopyLink}
              />
              <ShareOption
                icon="⋯"
                label="More"
                color="#8E8E93"
                onPress={handleMore}
              />
            </View>
          </ScrollView>
          
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  cancelText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
