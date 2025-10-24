import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Button from '@/components/ui/Button';
import Input from '@/components/forms/Input';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { sendOTP } from '@/lib/auth';
import { COUNTRIES, Country, sanitizePhoneNumber, removeLeadingZeros, toE164Format, validatePhoneNumber } from '@/utils/phoneNumber';

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to US
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  // Handle phone number input with proper sanitization
  const handlePhoneChange = (text: string) => {
    const cleaned = sanitizePhoneNumber(text);
    const withoutLeadingZeros = removeLeadingZeros(cleaned);
    setPhoneNumber(withoutLeadingZeros);
    
    // Clear validation error when user types
    if (validationError) {
      setValidationError('');
    }
  };

  // Validate phone number format
  const isValidPhone = () => {
    const validation = validatePhoneNumber(phoneNumber, selectedCountry);
    return validation.isValid;
  };

  // Format phone number in E.164 format
  const getE164Format = () => {
    try {
      return toE164Format(phoneNumber, selectedCountry);
    } catch (error) {
      return `${selectedCountry.code}${phoneNumber}`;
    }
  };

  const handleContinue = async () => {
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber, selectedCountry);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid phone number');
      Alert.alert('Invalid Phone Number', validation.error || 'Please enter a valid phone number.');
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSending(true);
    setValidationError('');

    try {
      const e164Number = getE164Format();
      console.log('📱 Sending OTP to E.164 format:', e164Number);

      const { success, error } = await sendOTP(e164Number);

      if (success) {
        // Navigate to OTP screen
        router.push({
          pathname: '/phone-otp',
          params: { phoneNumber: e164Number }
        });
      } else {
        Alert.alert(
          'Error',
          error || 'Failed to send verification code. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      setValidationError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    // Clear validation error when country changes
    if (validationError) {
      setValidationError('');
    }
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What's your phone number?</Text>
          <Text style={styles.subtitle}>
            We'll send you a code to verify your phone number
          </Text>
        </View>

        {/* Phone Input */}
        <View style={styles.form}>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity 
              style={styles.countryCodeButton}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            <Input
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              maxLength={15}
            />
          </View>

          {/* Validation Error */}
          {validationError ? (
            <Text style={styles.errorText}>{validationError}</Text>
          ) : null}

          {/* E.164 Format Preview */}
          {phoneNumber.length > 0 && isValidPhone() && (
            <Text style={styles.formatPreview}>
              Format: {getE164Format()}
            </Text>
          )}

          <Button
            title={isSending ? 'Sending...' : 'Continue'}
            onPress={handleContinue}
            size="large"
            fullWidth
            disabled={!isValidPhone() || isSending}
            style={styles.submitButton}
          />
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            📱 We'll send you a 6-digit verification code
          </Text>
          <Text style={styles.infoText}>
            🔒 Your number is safe and secure with us
          </Text>
          <Text style={styles.infoText}>
            ✅ Phone number must be in E.164 format
          </Text>
        </View>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.countryList}>
              {COUNTRIES.map((country, index) => (
                <TouchableOpacity
                  key={`${country.country}-${index}`}
                  style={[
                    styles.countryItem,
                    selectedCountry.country === country.country && styles.countryItemSelected
                  ]}
                  onPress={() => selectCountry(country)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{country.name}</Text>
                    <Text style={styles.countryCode}>{country.code}</Text>
                  </View>
                  {selectedCountry.country === country.country && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    minWidth: 100,
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryCodeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  dropdownIcon: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  phoneInput: {
    flex: 1,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: '#FF6B6B',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    fontWeight: FontWeights.medium,
  },
  formatPreview: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  infoContainer: {
    gap: Spacing.md,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.textSecondary,
    padding: Spacing.xs,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  countryItemSelected: {
    backgroundColor: Colors.backgroundGray,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  countryCode: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.purple,
    fontWeight: FontWeights.bold,
  },
});
