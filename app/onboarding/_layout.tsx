import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="name" />
      <Stack.Screen name="dateOfBirth" />
      <Stack.Screen name="zodiacSign" />
      <Stack.Screen name="primaryGoal" />
      <Stack.Screen name="location" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="lookingFor" />
      <Stack.Screen name="height" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="photos" />
      <Stack.Screen name="bio" />
    </Stack>
  );
}
