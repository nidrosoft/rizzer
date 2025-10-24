/**
 * Enhanced Share Utilities
 * Multi-platform sharing with custom messages
 * MAX 150 lines - Micro utility
 */

import { Share, Linking, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export interface ShareContent {
  title: string;
  message: string;
  url?: string;
  image?: string;
}

// Native share (system share sheet)
export const shareNative = async (content: ShareContent): Promise<boolean> => {
  try {
    const result = await Share.share({
      title: content.title,
      message: content.url ? `${content.message}\n\n${content.url}` : content.message,
    });
    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing:', error);
    Alert.alert('Error', 'Failed to share content.');
    return false;
  }
};

// Share to WhatsApp
export const shareToWhatsApp = async (message: string): Promise<boolean> => {
  try {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      Alert.alert('WhatsApp Not Installed', 'Please install WhatsApp to share.');
      return false;
    }
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    Alert.alert('Error', 'Failed to open WhatsApp.');
    return false;
  }
};

// Share via SMS
export const shareViaSMS = async (message: string, phoneNumber?: string): Promise<boolean> => {
  try {
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${phoneNumber || ''}${separator}body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      Alert.alert('Error', 'Failed to open SMS app.');
      return false;
    }
  } catch (error) {
    console.error('Error sharing via SMS:', error);
    Alert.alert('Error', 'Failed to open SMS.');
    return false;
  }
};

// Share via Email
export const shareViaEmail = async (
  subject: string,
  body: string,
  recipient?: string
): Promise<boolean> => {
  try {
    const url = `mailto:${recipient || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      Alert.alert('Error', 'Failed to open email app.');
      return false;
    }
  } catch (error) {
    console.error('Error sharing via email:', error);
    Alert.alert('Error', 'Failed to open email.');
    return false;
  }
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Link copied to clipboard.');
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Alert.alert('Error', 'Failed to copy to clipboard.');
    return false;
  }
};

// Share to Instagram Stories (requires specific setup)
export const shareToInstagram = async (message: string): Promise<boolean> => {
  try {
    // Instagram Stories sharing requires specific implementation
    // For now, we'll open Instagram app
    const url = 'instagram://story-camera';
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      // Copy message to clipboard for user to paste
      await Clipboard.setStringAsync(message);
      Alert.alert('Instagram Opened', 'Message copied to clipboard. Paste it in your story!');
      return true;
    } else {
      Alert.alert('Instagram Not Installed', 'Please install Instagram to share.');
      return false;
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    Alert.alert('Error', 'Failed to open Instagram.');
    return false;
  }
};

// Generate shareable link (placeholder - would be actual deep link in production)
export const generateShareLink = (type: string, id: string): string => {
  return `https://rizzers.app/${type}/${id}`;
};

// Format share message for different content types
export const formatShareMessage = (
  type: 'event' | 'date_plan' | 'date_idea' | 'hidden_gem',
  data: any
): string => {
  switch (type) {
    case 'event':
      return `🎉 Check out this event!\n\n${data.title}\n📅 ${data.date} at ${data.startTime}\n📍 ${data.location}\n\nJoin me!`;
    case 'date_plan':
      return `💕 I created this amazing date plan!\n\n${data.title}\n📅 ${data.date}\n\n${data.activities?.slice(0, 3).join('\n')}\n\nWant to join me?`;
    case 'date_idea':
      return `💡 Found the perfect date idea!\n\n${data.title}\n💰 ${data.budget}\n📍 ${data.location}\n\n${data.description}`;
    case 'hidden_gem':
      return `💎 Discovered this hidden gem!\n\n${data.name}\n📍 ${data.location}\n⭐ ${data.rating}\n\nLet's check it out together!`;
    default:
      return 'Check this out on Rizzers!';
  }
};
