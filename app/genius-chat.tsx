import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, Modal, Alert, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Microphone, AttachCircle, Send2, Trash, Archive, Gallery, Camera, DocumentText, Stop, MicrophoneSlash } from 'iconsax-react-native';
import PermissionModal from '@/components/ui/PermissionModal';
import AudioWaveform from '@/components/ui/AudioWaveform';
import TranscribingIndicator from '@/components/ui/TranscribingIndicator';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import Toast from '@/components/Toast';
import TypingIndicator from '@/components/ui/TypingIndicator';
import Markdown from 'react-native-markdown-display';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { getChatThreadById, getChatMessages, sendMessage, deleteChatThread, archiveChatThread } from '@/lib/geniusChat';
import { ChatMessage } from '@/lib/geniusChat';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function GeniusChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadTitle, setThreadTitle] = useState('Rizz Coach');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [showCameraPermissionModal, setShowCameraPermissionModal] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState('');

  useEffect(() => {
    if (id && user?.id) {
      loadThread();
      loadMessages();
    } else {
      setLoading(false);
      // If no ID, show error and go back
      if (!id) {
        console.error('No conversation ID provided');
        setTimeout(() => {
          router.back();
        }, 100);
      }
    }
  }, [id, user?.id]);

  const loadThread = async () => {
    if (!id) return;
    try {
      const result = await getChatThreadById(id);
      if (result.success && result.data) {
        setThreadTitle(result.data.title || 'Rizz Coach');
      }
    } catch (error) {
      console.error('Error loading thread:', error);
    }
  };

  const loadMessages = async () => {
    if (!id) return;
    try {
      const result = await getChatMessages(id);
      if (result.success && result.data) {
        const formattedMessages: Message[] = result.data.map((msg: ChatMessage) => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleMoreOptions = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleArchivePress = async () => {
    if (!id) return;
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowActionSheet(false);
    
    try {
      const result = await archiveChatThread(id);
      if (result.success) {
        setToastMessage('Chat archived');
        setShowToast(true);
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        setToastMessage('Failed to archive chat');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error archiving chat:', error);
      setToastMessage('Failed to archive chat');
      setShowToast(true);
    }
  };

  const handleDeletePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowActionSheet(false);
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    
    try {
      console.log('🗑️ Attempting to delete conversation:', id);
      const result = await deleteChatThread(id);
      
      if (result.success) {
        console.log('✅ Delete successful');
        setToastMessage('Chat deleted successfully');
        setShowToast(true);
        
        // Wait a moment then navigate back
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        console.error('❌ Delete failed:', result.error);
        setToastMessage(result.error || 'Failed to delete chat');
        setShowToast(true);
      }
    } catch (error: any) {
      console.error('❌ Error deleting chat:', error);
      setToastMessage(error.message || 'Failed to delete chat');
      setShowToast(true);
    }
  };

  const handleCancelDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowDeleteModal(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || sending) return;
    
    if (!id) {
      console.error('No conversation ID');
      setToastMessage('Please create a conversation first');
      setShowToast(true);
      return;
    }
    
    const messageText = message.trim();
    setMessage('');
    setSending(true);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Optimistically add user message
    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempMessage]);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Send message and get AI response
      const result = await sendMessage(id, user.id, messageText);
      
      if (result.success && result.data) {
        // Remove temp message and typing indicator
        setIsTyping(false);
        
        // Stream the AI response
        const aiMessageId = result.data.aiMessage.id;
        const fullText = result.data.aiMessage.content;
        const userMessageData = result.data.userMessage;
        const aiTimestamp = new Date(result.data.aiMessage.created_at);
        
        // Add both user and AI messages immediately with final content
        setMessages(prev => {
          const withoutTemp = prev.filter(m => !m.id.startsWith('temp-'));
          return [
            ...withoutTemp,
            {
              id: userMessageData.id,
              text: userMessageData.content,
              isUser: true,
              timestamp: new Date(userMessageData.created_at),
            },
            {
              id: aiMessageId,
              text: '', // Start empty for streaming
              isUser: false,
              timestamp: aiTimestamp,
            },
          ];
        });
        
        setStreamingMessageId(aiMessageId);
        setStreamedText('');
        
        // Stream the text character by character
        let currentIndex = 0;
        const streamInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            currentIndex++;
            
            // Update the message with streamed text
            setMessages(prev => 
              prev.map(m => 
                m.id === aiMessageId 
                  ? { ...m, text: fullText.substring(0, currentIndex) }
                  : m
              )
            );
            
            // Haptic feedback every 5 characters
            if (currentIndex % 5 === 0 && Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            
            // Scroll to bottom
            scrollViewRef.current?.scrollToEnd({ animated: true });
          } else {
            // Streaming complete - ensure final text is set
            clearInterval(streamInterval);
            setStreamingMessageId(null);
            setStreamedText('');
            
            // Final update to ensure full text is displayed
            setMessages(prev => 
              prev.map(m => 
                m.id === aiMessageId 
                  ? { ...m, text: fullText }
                  : m
              )
            );
          }
        }, 0); // Instant - no delay
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setMessage(messageText);
      setToastMessage(error.message || 'Failed to send message');
      setShowToast(true);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setSending(false);
    }
  };

  const handleVoiceInput = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (recording) {
      // Stop recording
      await stopRecording();
    } else {
      // Start recording
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      // Clean up any existing recording first
      if (audioRecording) {
        try {
          await audioRecording.stopAndUnloadAsync();
          setAudioRecording(null);
        } catch (e) {
          console.log('Cleaned up previous recording');
        }
      }

      // Check permission status first
      const { status } = await Audio.getPermissionsAsync();
      
      if (status === 'undetermined') {
        // Show custom permission modal
        setShowMicPermissionModal(true);
        return;
      }
      
      if (status !== 'granted') {
        setToastMessage('Microphone permission required');
        setShowToast(true);
        return;
      }

      // Configure audio mode for iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording with settings compatible with Whisper API
      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      setAudioRecording(recording);
      setRecording(true);
      
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setToastMessage('Failed to start recording');
      setShowToast(true);
    }
  };

  const handleMicPermissionAllow = async () => {
    setShowMicPermissionModal(false);
    const permission = await Audio.requestPermissionsAsync();
    if (permission.granted) {
      startRecording();
    } else {
      setToastMessage('Microphone permission denied');
      setShowToast(true);
    }
  };

  const stopRecording = async () => {
    if (!audioRecording) return;

    try {
      setRecording(false);
      
      // Get URI before stopping
      const uri = audioRecording.getURI();
      
      // Stop and unload
      await audioRecording.stopAndUnloadAsync();
      
      // Clear the recording reference
      setAudioRecording(null);
      
      if (uri) {
        console.log('🎤 Recording stopped, transcribing...');
        await transcribeAudio(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setToastMessage('Failed to process recording');
      setShowToast(true);
      // Make sure to clear the recording even on error
      setAudioRecording(null);
    }
  };

  const transcribeAudio = async (audioUri: string) => {
    try {
      setIsTranscribing(true);

      console.log('📝 Transcribing audio from:', audioUri);

      // For React Native, we need to use the file URI directly
      const formData = new FormData();
      
      // Append the audio file using React Native's format
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      
      formData.append('language', 'en');

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();

      // Call transcribe Edge Function
      const transcribeResponse = await fetch(
        'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/transcribe-audio',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: formData,
        }
      );

      const data = await transcribeResponse.json();

      if (data.success && data.text) {
        // Set the transcribed text as the message
        setMessage(data.text);
        setToastMessage('Transcribed successfully!');
        setShowToast(true);
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      setToastMessage('Failed to transcribe audio');
      setShowToast(true);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAttachment = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowAttachmentMenu(true);
  };

  const handleImagePicker = async (source: 'camera' | 'gallery') => {
    try {
      setShowAttachmentMenu(false);

      let result;
      if (source === 'camera') {
        // Check permission status first
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        
        if (status === 'undetermined') {
          // Show custom permission modal
          setShowCameraPermissionModal(true);
          return;
        }
        
        if (status !== 'granted') {
          setToastMessage('Camera permission required');
          setShowToast(true);
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        
        // Analyze the image
        if (asset.base64) {
          await analyzeImage(asset.base64, asset.uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setToastMessage('Failed to pick image');
      setShowToast(true);
    }
  };

  const analyzeImage = async (base64: string, uri: string) => {
    try {
      setAnalyzingImage(true);

      console.log('🖼️ Analyzing image...');

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Call analyze-image Edge Function
      const response = await fetch(
        'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/analyze-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': session.access_token,
          },
          body: JSON.stringify({
            imageBase64: base64,
            prompt: 'Analyze this image in the context of dating and relationships. Provide helpful insights and advice.',
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Image analysis error response:', errorText);
        throw new Error(`Failed to analyze image: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.analysis) {
        // Add the analysis as a message
        setMessage(data.analysis);
        setToastMessage('Image analyzed successfully!');
        setShowToast(true);
        // Clear the selected image
        setSelectedImage(null);
      } else {
        throw new Error(data.error || 'Image analysis failed');
      }
    } catch (error: any) {
      console.error('Image analysis error:', error);
      setToastMessage(error.message || 'Failed to analyze image');
      setShowToast(true);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleCameraPermissionAllow = async () => {
    setShowCameraPermissionModal(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        if (asset.base64) {
          await analyzeImage(asset.base64, asset.uri);
        }
      }
    } else {
      setToastMessage('Camera permission denied');
      setShowToast(true);
    }
  };

  return (
    <LinearGradient
      colors={['#E6E9EB', '#FFFFFF']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleBack}
            activeOpacity={0.6}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{threadTitle}</Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleMoreOptions}
            activeOpacity={0.6}
          >
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
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && !loading ? (
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>Start a conversation with your dating coach!</Text>
            </View>
          ) : loading ? (
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>Loading...</Text>
            </View>
          ) : (
            messages.map((msg) => (
              msg.isUser ? (
                <View key={msg.id} style={styles.userMessageContainer}>
                  <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    style={styles.userMessageBubble}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.userMessageText}>
                      {msg.text}
                    </Text>
                  </LinearGradient>
                </View>
              ) : (
                <View key={msg.id} style={styles.aiMessageContainer}>
                  <View style={styles.aiMessageBubble}>
                    <Markdown style={markdownStyles}>
                      {msg.text}
                    </Markdown>
                  </View>
                </View>
              )
            ))
          )}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity 
              style={styles.inputIconButton}
              onPress={handleAttachment}
              activeOpacity={0.6}
            >
              <AttachCircle size={24} color={Colors.textSecondary} variant="Bold" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder="Ask anything..."
              placeholderTextColor={Colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={styles.inputIconButton}
              onPress={handleVoiceInput}
              activeOpacity={0.6}
            >
              {recording ? (
                <AudioWaveform isRecording={recording} color={Colors.textSecondary} />
              ) : (
                <Microphone size={24} color={Colors.textSecondary} variant="Bold" />
              )}
            </TouchableOpacity>
          </View>
        
        <TouchableOpacity 
          style={[styles.sendButton, (!message.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          activeOpacity={0.8}
          disabled={!message.trim() || sending}
        >
          <LinearGradient
            colors={message.trim() && !sending ? [Colors.gradientStart, Colors.gradientEnd] : ['#E0E0E0', '#E0E0E0']}
            style={styles.sendButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Send2 size={20} color={Colors.textWhite} variant="Bold" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

    {/* Action Sheet */}
    <Modal
      visible={showActionSheet}
      transparent
      animationType="slide"
      onRequestClose={() => setShowActionSheet(false)}
    >
      <TouchableOpacity 
        style={styles.actionSheetOverlay}
        activeOpacity={1}
        onPress={() => setShowActionSheet(false)}
      >
        <View style={styles.actionSheet}>
          <View style={styles.actionSheetHandle} />
          <Text style={styles.actionSheetTitle}>Chat Options</Text>
          
          <TouchableOpacity 
            style={styles.actionSheetOption}
            onPress={handleArchivePress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionSheetIconContainer, { backgroundColor: `${Colors.purple}15` }]}>
              <Archive size={22} color={Colors.purple} variant="Bold" />
            </View>
            <View style={styles.actionSheetTextContainer}>
              <Text style={styles.actionSheetOptionText}>Archive Chat</Text>
              <Text style={styles.actionSheetOptionSubtext}>Hide from list</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionSheetDivider} />

          <TouchableOpacity 
            style={styles.actionSheetOption}
            onPress={handleDeletePress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionSheetIconContainer, { backgroundColor: '#FFE5E5' }]}>
              <Trash size={22} color="#FF4444" variant="Bold" />
            </View>
            <View style={styles.actionSheetTextContainer}>
              <Text style={[styles.actionSheetOptionText, { color: '#FF4444' }]}>Delete Chat</Text>
              <Text style={styles.actionSheetOptionSubtext}>Remove permanently</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>

    {/* Delete Confirmation Modal */}
    <Modal
      visible={showDeleteModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.deleteModal}>
          <View style={styles.deleteModalIcon}>
            <Trash size={24} color="#FF4444" variant="Bold" />
          </View>
          <Text style={styles.deleteModalTitle}>Delete this chat?</Text>
          <Text style={styles.deleteModalMessage}>
            Once deleted, all messages will be permanently removed.
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleConfirmDelete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.deleteButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.deleteButtonText}>Yes, delete</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      {/* Attachment Menu */}
      <Modal
        visible={showAttachmentMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentMenu(false)}
      >
        <TouchableOpacity 
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowAttachmentMenu(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Add Attachment</Text>
            
            <TouchableOpacity 
              style={styles.actionSheetOption}
              onPress={() => handleImagePicker('camera')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconContainer, { backgroundColor: `${Colors.purple}15` }]}>
                <Camera size={22} color={Colors.purple} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Take Photo</Text>
                <Text style={styles.actionSheetOptionSubtext}>Use camera</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionSheetDivider} />

            <TouchableOpacity 
              style={styles.actionSheetOption}
              onPress={() => handleImagePicker('gallery')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconContainer, { backgroundColor: `${Colors.gradientStart}15` }]}>
                <Gallery size={22} color={Colors.gradientStart} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Choose from Gallery</Text>
                <Text style={styles.actionSheetOptionSubtext}>Select photo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Selected Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <View style={styles.transcribingContainer}>
          <TranscribingIndicator visible={isTranscribing} />
        </View>
      )}

      {/* Microphone Permission Modal */}
      <PermissionModal
        visible={showMicPermissionModal}
        onClose={() => setShowMicPermissionModal(false)}
        onAllow={handleMicPermissionAllow}
        title="Microphone Access"
        message="Allow Rizz Coach to access your microphone to transcribe voice messages."
        icon={<Microphone size={28} color={Colors.purple} variant="Bold" />}
        iconColor={Colors.purple}
      />

      {/* Camera Permission Modal */}
      <PermissionModal
        visible={showCameraPermissionModal}
        onClose={() => setShowCameraPermissionModal(false)}
        onAllow={handleCameraPermissionAllow}
        title="Camera Access"
        message="Allow Rizz Coach to access your camera to analyze photos and provide insights."
        icon={<Camera size={28} color={Colors.gradientStart} variant="Bold" />}
        iconColor={Colors.gradientStart}
      />

      {/* Toast */}
      <Toast visible={showToast} message={toastMessage} onHide={() => setShowToast(false)} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 3,
  },
  emptyChatText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: Spacing.md,
  },
  userMessageBubble: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4, 
  },
  userMessageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.textWhite,
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginBottom: Spacing.md,
  },
  aiMessageBubble: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4, 
    borderBottomRightRadius: 16,
  },
  aiMessageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
  },
  inputIconButton: {
    padding: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetOverlay: {
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
  actionSheetIconContainer: {
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
  },
  deleteModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '85%',
    position: 'relative',
  },
  deleteModalIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
  },
  deleteModalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  deleteButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  deleteButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  imagePreview: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.lg,
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: FontWeights.bold,
  },
  transcribingContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Markdown styles for AI messages
const markdownStyles = {
  body: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.text,
  },
  heading1: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  heading2: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  strong: {
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  em: {
    fontStyle: 'italic',
  },
  list_item: {
    marginBottom: Spacing.xs,
  },
  bullet_list: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ordered_list: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  code_inline: {
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  link: {
    color: Colors.purple,
    textDecorationLine: 'underline',
  },
};
