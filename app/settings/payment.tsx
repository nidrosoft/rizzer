/**
 * Payment Method Settings Page
 * Manage payment methods
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import { 
  Wallet2,
  Card,
  Apple,
  Google,
  Add,
  TickCircle,
} from 'iconsax-react-native';
import { Colors, Spacing, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function PaymentSettings() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAddCard = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Add Payment Method', 'Payment method addition coming soon!');
  };

  const paymentMethods = [
    { id: 'card', icon: Card, label: 'Credit Card', value: '•••• 4242', type: 'Visa' },
    { id: 'apple', icon: Apple, label: 'Apple Pay', value: 'john@icloud.com', type: 'Apple' },
    { id: 'google', icon: Google, label: 'Google Pay', value: 'john@gmail.com', type: 'Google' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.card}>
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <React.Fragment key={method.id}>
                  <TouchableOpacity
                    style={styles.methodRow}
                    onPress={() => {
                      if (Platform.OS === 'ios') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setSelectedMethod(method.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.methodLeft}>
                      <View style={[
                        styles.methodIcon,
                        isSelected && styles.methodIconSelected
                      ]}>
                        <Icon 
                          size={22} 
                          color={isSelected ? Colors.purple : Colors.text} 
                          variant={isSelected ? 'Bold' : 'Outline'}
                        />
                      </View>
                      <View>
                        <Text style={styles.methodLabel}>{method.label}</Text>
                        <Text style={styles.methodValue}>{method.value}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <TickCircle size={24} color={Colors.purple} variant="Bold" />
                    )}
                  </TouchableOpacity>
                  {index < paymentMethods.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddCard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButtonGradient}
            >
              <Add size={24} color={Colors.textWhite} variant="Bold" />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure. We never store your full card details.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  methodIconSelected: {
    backgroundColor: `${Colors.purple}15`,
  },
  methodLabel: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  methodValue: {
    fontSize: normalize(13),
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
  },
  addButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  addButtonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoText: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
});
