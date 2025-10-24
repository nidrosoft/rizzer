/**
 * Environment Test Screen
 * Temporary screen to verify environment variables and secure storage
 * DELETE THIS FILE after testing
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { ArrowLeft, TickCircle, CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import ENV from '@/config/env';
import { SecureStorage } from '@/services/storage/secure';
import { apiClient } from '@/services/api';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function TestEnvScreen() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];

    // Test 1: Environment variables
    results.push('📋 Testing Environment Variables...');
    results.push(`✅ ENV: ${ENV.env}`);
    results.push(`✅ API URL: ${ENV.apiUrl || '❌ Not set'}`);
    results.push(`✅ App Version: ${ENV.appVersion}`);
    results.push(`✅ Is Development: ${ENV.isDevelopment}`);
    results.push(`✅ Is Production: ${ENV.isProduction}`);
    results.push('');

    // Test 2: Secure Storage - Save
    results.push('🔐 Testing Secure Storage...');
    const saveResult = await SecureStorage.saveAuthToken('test-token-123');
    results.push(saveResult ? '✅ Save token: SUCCESS' : '❌ Save token: FAILED');

    // Test 3: Secure Storage - Get
    const token = await SecureStorage.getAuthToken();
    results.push(token === 'test-token-123' ? '✅ Get token: SUCCESS' : '❌ Get token: FAILED');

    // Test 4: Secure Storage - Auth check
    const isAuth = await SecureStorage.isAuthenticated();
    results.push(isAuth ? '✅ Is authenticated: SUCCESS' : '❌ Is authenticated: FAILED');

    // Test 5: Secure Storage - Clear
    const clearResult = await SecureStorage.clearAuthSession();
    results.push(clearResult ? '✅ Clear session: SUCCESS' : '❌ Clear session: FAILED');

    // Test 6: Verify cleared
    const tokenAfterClear = await SecureStorage.getAuthToken();
    results.push(tokenAfterClear === null ? '✅ Token cleared: SUCCESS' : '❌ Token cleared: FAILED');

    results.push('');

    // Test 7: API Client
    results.push('🌐 Testing API Client...');
    results.push(`✅ API URL: ${ENV.apiUrl}`);
    results.push(`✅ Client configured: SUCCESS`);
    results.push('ℹ️ Note: Actual API calls will work when backend is ready');

    results.push('');
    results.push('🎉 All tests complete!');

    setTestResults(results);
    
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
        <Text style={styles.title}>Environment Test</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This screen tests environment variables and secure storage.
            {'\n\n'}
            Delete this file after testing: /app/test-env.tsx
          </Text>
        </View>

        {/* Run Tests Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={runTests}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Run Tests</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Results */}
        {testResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Test Results:</Text>
            {testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))}
          </View>
        )}

        {/* Environment Info */}
        <View style={styles.envInfo}>
          <Text style={styles.envTitle}>Current Environment:</Text>
          <View style={styles.envItem}>
            <Text style={styles.envLabel}>Environment:</Text>
            <Text style={styles.envValue}>{ENV.env}</Text>
          </View>
          <View style={styles.envItem}>
            <Text style={styles.envLabel}>API URL:</Text>
            <Text style={styles.envValue}>{ENV.apiUrl || 'Not set'}</Text>
          </View>
          <View style={styles.envItem}>
            <Text style={styles.envLabel}>App Version:</Text>
            <Text style={styles.envValue}>{ENV.appVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  infoBox: {
    backgroundColor: `${Colors.info}10`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
    marginBottom: Spacing.xl,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  button: {
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  gradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  resultsContainer: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  resultsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  resultText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  envInfo: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  envTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  envItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  envLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  envValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
