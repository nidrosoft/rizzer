/**
 * Edit Profile Sheet Component
 * Bottom sheet for editing profile information
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface EditProfileSheetProps {
  visible: boolean;
  data: ProfileData;
  hasChanges: boolean;
  onClose: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSave: () => void;
}

export default function EditProfileSheet({
  visible,
  data,
  hasChanges,
  onClose,
  onFieldChange,
  onSave,
}: EditProfileSheetProps) {
  const handleSave = () => {
    if (!data.fullName.trim() || !data.email.trim() || 
        !data.phone.trim() || !data.location.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSave();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <CloseCircle size={28} color={Colors.text} variant="Bold" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={data.fullName}
                  onChangeText={(text) => onFieldChange('fullName', text)}
                  placeholder="First name"
                  placeholderTextColor={Colors.textLight}
                  autoCapitalize="words"
                />
                <View style={styles.underline} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={data.email}
                  onChangeText={(text) => onFieldChange('email', text)}
                  placeholder="email@example.com"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.underline} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={data.phone}
                  onChangeText={(text) => onFieldChange('phone', text)}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="phone-pad"
                />
                <View style={styles.underline} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={data.location}
                  onChangeText={(text) => onFieldChange('location', text)}
                  placeholder="City, State"
                  placeholderTextColor={Colors.textLight}
                />
                <View style={styles.underline} />
              </View>

              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  !hasChanges && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={!hasChanges}
              >
                <LinearGradient
                  colors={hasChanges ? [Colors.gradientStart, Colors.gradientEnd] : [Colors.borderLight, Colors.borderLight]}
                  style={styles.saveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: normalize(20),
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveGradient: {
    paddingVertical: Spacing.md + 4,
    alignItems: 'center',
  },
  saveText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
