import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Call, ArrowRight, CloseSquare, ArrowDown2, TickCircle } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { sendOTP } from '@/lib/auth';
import { COUNTRIES, Country, sanitizePhoneNumber, removeLeadingZeros, toE164Format, validatePhoneNumber, formatPhoneDisplay } from '@/utils/phoneNumber';

export default function PhoneEntryScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '', emoji: '' });

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

  // Get funny error message based on error type
  const getFunnyErrorMessage = (error: string) => {
    const errorLower = error.toLowerCase();
    
    // Too many digits
    if (phoneNumber.length > selectedCountry.maxLength) {
      return {
        emoji: '🤔',
        title: 'Whoa, that\'s a long number!',
        message: `Phone numbers in ${selectedCountry.name} are usually ${selectedCountry.maxLength} digits. Looks like you added a few extra! Double-check and try again.`
      };
    }
    
    // Too few digits
    if (phoneNumber.length < selectedCountry.minLength) {
      return {
        emoji: '🧐',
        title: 'Hmm, something\'s missing...',
        message: `Phone numbers in ${selectedCountry.name} need at least ${selectedCountry.minLength} digits. You're almost there!`
      };
    }
    
    // Invalid format from Twilio
    if (errorLower.includes('not a valid phone number') || errorLower.includes('invalid')) {
      return {
        emoji: '😅',
        title: 'Oops! That doesn\'t look right',
        message: `We couldn't recognize this as a valid ${selectedCountry.name} phone number. Mind double-checking it?`
      };
    }
    
    // Network or server error
    if (errorLower.includes('network') || errorLower.includes('connection')) {
      return {
        emoji: '📡',
        title: 'Connection hiccup!',
        message: 'Looks like the internet gremlins are at it again. Check your connection and give it another shot!'
      };
    }
    
    // Rate limit
    if (errorLower.includes('rate') || errorLower.includes('too many')) {
      return {
        emoji: '⏰',
        title: 'Slow down there, speedy!',
        message: 'You\'re trying too fast! Take a breather and try again in a minute.'
      };
    }
    
    // Default funny error
    return {
      emoji: '🤷‍♂️',
      title: 'Well, this is awkward...',
      message: 'Something unexpected happened. But hey, even the best apps have their moments! Try again?'
    };
  };

  const handleContinue = async () => {
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber, selectedCountry);
    
    if (!validation.isValid) {
      const funnyError = getFunnyErrorMessage(validation.error || '');
      setErrorMessage(funnyError);
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setValidationError('');

    try {
      // Format phone number in E.164 format
      const e164Number = toE164Format(phoneNumber, selectedCountry);
      console.log('📱 Sending OTP to E.164 format:', e164Number);

      // Send OTP via Supabase
      const { success, error } = await sendOTP(e164Number);

      if (success) {
        // Navigate to OTP screen
        router.push({
          pathname: '/phone-otp',
          params: { phoneNumber: e164Number }
        });
      } else {
        // Show funny error modal instead of alert
        const funnyError = getFunnyErrorMessage(error || '');
        setErrorMessage(funnyError);
        setShowErrorModal(true);
      }
    } catch (err: any) {
      const funnyError = getFunnyErrorMessage(err.message || '');
      setErrorMessage(funnyError);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    // Clear validation error when country changes
    if (validationError) {
      setValidationError('');
    }
  };

  // Validate phone number for UI state
  const validation = validatePhoneNumber(phoneNumber, selectedCountry);
  const isValid = validation.isValid;

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <CloseSquare size={28} color={Colors.text} variant="Outline" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Call size={28} color={Colors.text} variant="Outline" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>What's your phone number?</Text>

        {/* Phone Input */}
        <View style={styles.phoneInputSection}>
          <TouchableOpacity 
            style={styles.countrySelector}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={styles.countryCode}>{selectedCountry.code}</Text>
            <ArrowDown2 size={16} color={Colors.textSecondary} variant="Outline" />
          </TouchableOpacity>

          <View style={styles.inputDivider} />

          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            placeholder=""
            maxLength={15}
            autoFocus
          />
        </View>

        <View style={styles.underline} />

        {/* Validation Error */}
        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        {/* E.164 Format Preview */}
        {phoneNumber.length > 0 && isValid ? (
          <Text style={styles.formatPreview}>
            Format: {toE164Format(phoneNumber, selectedCountry)}
          </Text>
        ) : null}

        {/* Info Text */}
        <Text style={styles.infoText}>
          Rizzer will send you a text with a verification code.{' \n'}
          Message and data rates may apply.
        </Text>

        {/* Bottom Section - Help Text and Continue Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Text style={styles.helpText}>What if my number changes?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, (!isValid || isLoading) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!isValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <ArrowRight 
                size={28} 
                color={isValid ? Colors.background : Colors.border} 
                variant="Outline"
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Info Modal - What if my number changes? */}
      <Modal
        visible={showInfoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>What if my number changes?</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <CloseSquare size={24} color={Colors.text} variant="Outline" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoModalBody}>
              <Text style={styles.infoModalText}>
                Your phone number verifies your identity and keeps your account secure. You can update it anytime in settings, and all your data will remain safe.
              </Text>
              
              <View style={styles.infoModalBullet}>
                <TickCircle size={20} color={Colors.purple} variant="Bold" />
                <Text style={styles.infoModalBulletText}>
                  Update anytime in account settings
                </Text>
              </View>
              
              <View style={styles.infoModalBullet}>
                <TickCircle size={20} color={Colors.purple} variant="Bold" />
                <Text style={styles.infoModalBulletText}>
                  Your data and progress remain safe
                </Text>
              </View>
            </View>
            
            <LinearGradient
              colors={['#EC4899', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.infoModalButton}
            >
              <TouchableOpacity 
                style={styles.infoModalButtonInner}
                onPress={() => setShowInfoModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.infoModalButtonText}>Got it</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Error Modal - Funny Error Messages */}
      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.errorEmojiContainer}>
              <Text style={styles.errorEmoji}>{errorMessage.emoji}</Text>
            </View>
            
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>{errorMessage.title}</Text>
            </View>
            
            <View style={styles.infoModalBody}>
              <Text style={styles.infoModalText}>
                {errorMessage.message}
              </Text>
            </View>
            
            <LinearGradient
              colors={['#EC4899', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.infoModalButton}
            >
              <TouchableOpacity 
                style={styles.infoModalButtonInner}
                onPress={() => setShowErrorModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.infoModalButtonText}>Got it, let me fix that!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Country Selector Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowCountryModal(false)}
            >
              <CloseSquare size={28} color={Colors.text} variant="Outline" />
            </TouchableOpacity>
          </View>

          {/* Countries List */}
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item, index) => `${item.code}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleCountrySelect(item)}
              >
                <Text style={styles.countryName}>{item.name}</Text>
                <View style={styles.countryRight}>
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryCodeText}>{item.code}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  logoContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  phoneInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  flag: {
    fontSize: normalize(24),
  },
  countryCode: {
    fontSize: normalize(20),
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  inputDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
    marginRight: Spacing.md,
  },
  phoneInput: {
    flex: 1,
    fontSize: normalize(20),
    color: Colors.text,
    padding: 0,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: normalize(14),
    color: '#FF6B6B',
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  formatPreview: {
    fontSize: normalize(14),
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    lineHeight: normalize(20),
    marginBottom: Spacing.xl,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  helpButton: {
    flex: 1,
    paddingTop: 4,
  },
  helpText: {
    fontSize: normalize(14),
    color: Colors.purple,
    fontWeight: FontWeights.medium,
  },
  continueButton: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  continueButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  modalCloseButton: {
    position: 'absolute',
    right: Spacing.lg,
    padding: Spacing.sm,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  countryName: {
    fontSize: normalize(16),
    color: Colors.text,
  },
  countryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  countryFlag: {
    fontSize: normalize(20),
  },
  countryCodeText: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.lg,
  },
  // Info Modal Styles
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  infoModalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoModalTitle: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
  },
  infoModalBody: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  infoModalText: {
    fontSize: normalize(15),
    color: Colors.text,
    lineHeight: normalize(22),
    marginBottom: Spacing.md,
  },
  infoModalBold: {
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  infoModalBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoModalBulletText: {
    flex: 1,
    fontSize: normalize(15),
    color: Colors.text,
    lineHeight: normalize(22),
  },
  infoModalButton: {
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  infoModalButtonInner: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalButtonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
  // Error Modal Styles
  errorEmojiContainer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  errorEmoji: {
    fontSize: normalize(56),
  },
});
