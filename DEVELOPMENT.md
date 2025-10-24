# Development Guide - Rizzer App

## Getting Started

### Initial Setup
1. Ensure you have Node.js v18+ installed
2. Install Expo CLI globally: `npm install -g expo-cli`
3. Install dependencies: `npm install`
4. Start development server: `npm start`

## Development Workflow

### Running the App
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Clear cache and restart
npm start -- --clear
```

### Project Commands
```bash
# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Format code
npm run format
```

## Code Organization

### Adding New Screens

#### 1. Auth Screens
Place in `app/auth/` directory:
```typescript
// app/auth/forgot-password.tsx
import { useRouter } from 'expo-router';
// ... component code
```

#### 2. Onboarding Screens
Place in `app/onboarding/` directory and update `_layout.tsx`:
```typescript
<Stack.Screen name="newScreen" />
```

#### 3. Tab Screens
Place in `app/tabs/` directory and update `_layout.tsx`:
```typescript
<Tabs.Screen
  name="newTab"
  options={{
    title: 'New Tab',
    tabBarIcon: ({ color }) => <TabIcon icon="🆕" color={color} />
  }}
/>
```

### Creating Components

#### UI Components
Place in `components/ui/`:
```typescript
// components/ui/Card.tsx
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
```

#### Form Components
Place in `components/forms/`:
```typescript
// components/forms/Select.tsx
import Input from './Input';
// ... component code
```

### Using the Theme System

```typescript
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
});
```

### Navigation

#### Programmatic Navigation
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/auth/signin');

// Navigate with params
router.push({
  pathname: '/auth/otp',
  params: { phoneNumber: '+1234567890' }
});

// Replace current screen
router.replace('/tabs');

// Go back
router.back();
```

#### Getting Route Params
```typescript
import { useLocalSearchParams } from 'expo-router';

const { phoneNumber } = useLocalSearchParams();
```

## State Management (To Be Implemented)

### Zustand Store Structure
```typescript
// store/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### Using Stores
```typescript
import { useUserStore } from '@/store/userStore';

const { user, setUser } = useUserStore();
```

## API Integration (To Be Implemented)

### Service Layer Structure
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const authService = {
  signIn: async (email: string, password: string) => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  },
};
```

## Styling Guidelines

### 1. Use Theme Constants
Always use theme constants instead of hardcoded values:
```typescript
// ❌ Bad
backgroundColor: '#6C63FF'

// ✅ Good
backgroundColor: Colors.purple
```

### 2. Consistent Spacing
```typescript
// ❌ Bad
padding: 15

// ✅ Good
padding: Spacing.md
```

### 3. Responsive Design
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.9;
```

### 4. Platform-Specific Styles
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

## Performance Optimization

### 1. Memoization
```typescript
import { useMemo, useCallback } from 'react';

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### 2. FlatList Optimization
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

### 3. Image Optimization
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

## Testing

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Debugging

### React Native Debugger
1. Install React Native Debugger
2. Run app in development mode
3. Press `Cmd+D` (iOS) or `Cmd+M` (Android)
4. Select "Debug"

### Expo Dev Tools
```bash
# Open Expo Dev Tools
npm start
# Press 'd' to open developer menu
```

### Console Logging
```typescript
console.log('Debug:', value);
console.warn('Warning:', warning);
console.error('Error:', error);
```

## Common Issues & Solutions

### 1. Metro Bundler Cache Issues
```bash
npm start -- --clear
# or
rm -rf node_modules/.cache
```

### 2. iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all
```

### 3. Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### 4. TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

## Best Practices

### 1. Component Structure
```typescript
// Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Types
interface Props {
  title: string;
}

// Component
export default function MyComponent({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### 2. Error Handling
```typescript
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

### 3. Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitData();
  } finally {
    setLoading(false);
  }
};
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
```

Access in code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
