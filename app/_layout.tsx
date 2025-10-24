import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthProvider';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="splash" />
                <Stack.Screen name="landing" />
                <Stack.Screen name="phone-entry" />
                <Stack.Screen name="phone-otp" />
                <Stack.Screen 
                  name="auth" 
                  options={{
                    presentation: 'card',
                  }}
                />
                <Stack.Screen 
                  name="onboarding" 
                  options={{
                    presentation: 'card',
                  }}
                />
                <Stack.Screen 
                  name="tabs" 
                  options={{
                    gestureEnabled: false,
                  }}
                />
              </Stack>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
