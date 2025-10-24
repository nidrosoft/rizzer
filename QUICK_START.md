# 🚀 Quick Start Guide - Rizzer App

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd /Users/blackpanther/Desktop/Rizzers
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Choose Your Platform

#### Option A: iOS Simulator (Mac Only)
Press `i` in the terminal or run:
```bash
npm run ios
```

#### Option B: Android Emulator
Press `a` in the terminal or run:
```bash
npm run android
```

#### Option C: Web Browser
Press `w` in the terminal or run:
```bash
npm run web
```

#### Option D: Physical Device
1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in terminal

## 📱 App Navigation Flow

### First Time User Journey
1. **Splash Screen** (2 seconds) → Auto-navigates
2. **Auth Welcome** → Tap "Sign Up" or "Log In"
3. **Sign Up/In** → Enter credentials
4. **Phone Verification** → Enter phone number
5. **OTP** → Enter 6-digit code
6. **Onboarding** → Complete 12 steps
7. **Main App** → Explore 4 tabs

### Main App Tabs
- **🏠 Home**: Dashboard with quick actions
- **⚡ Rizz**: AI conversation starters
- **📅 Dates**: Manage connections
- **🧭 Discovery**: Events and tips

## 🎨 Key Features to Test

### Home Screen
- Scroll through Quick Actions
- View My Rizz collection
- Check Upcoming Events
- Tap Premium Upgrade card

### Rizz Screen
- Switch between "My Rizz" and "Generate Rizz" tabs
- Browse rizz cards by category
- Try the AI chat interface
- Tap the + button to add new rizz

### Dates Screen
- Search for dates
- View date profiles
- Check compatibility scores
- Explore Quick Actions

### Discovery Screen
- Read daily dating tip
- Browse trending topics
- Filter events by category
- Vote on top rizz

## 🔧 Development Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run TypeScript check
npx tsc --noEmit

# View project in browser
npm run web
```

## 📂 Project Structure Quick Reference

```
app/
├── auth/          # Login, signup, verification
├── onboarding/    # 12-step user setup
└── tabs/          # Main app (Home, Rizz, Dates, Discovery)

components/
├── ui/            # Button, OnboardingScreen
└── forms/         # Input

constants/
├── theme.ts       # Colors, spacing, fonts
└── types.ts       # TypeScript definitions
```

## 🎯 Testing Checklist

- [ ] Splash screen animation works
- [ ] Can navigate through auth flow
- [ ] Onboarding progress bar updates
- [ ] All 4 tabs are accessible
- [ ] Horizontal scrolling works
- [ ] Buttons respond to taps
- [ ] Input fields accept text
- [ ] Navigation back button works

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### TypeScript Errors
Restart TypeScript server in VS Code:
`Cmd+Shift+P` → "TypeScript: Restart TS Server"

### iOS Simulator Not Opening
```bash
# Check if Xcode is installed
xcode-select --install
```

### Android Emulator Issues
Ensure Android Studio and emulator are properly set up

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

## 📖 Documentation

- **README.md**: Full project overview
- **DEVELOPMENT.md**: Development best practices
- **PROJECT_SUMMARY.md**: Completed features list

## 🎨 Design System Quick Reference

### Colors
```typescript
import { Colors } from '@/constants/theme';

Colors.primary      // #FFD700 (Yellow)
Colors.purple       // #6C63FF
Colors.background   // #FFFFFF
Colors.text         // #1A1A1A
```

### Spacing
```typescript
import { Spacing } from '@/constants/theme';

Spacing.sm   // 8px
Spacing.md   // 16px
Spacing.lg   // 24px
Spacing.xl   // 32px
```

### Components
```typescript
import Button from '@/components/ui/Button';
import Input from '@/components/forms/Input';

<Button title="Click Me" onPress={handlePress} />
<Input placeholder="Enter text" value={text} onChangeText={setText} />
```

## 🚀 Next Steps

1. **Explore the UI**: Navigate through all screens
2. **Check the Code**: Review component implementations
3. **Read Docs**: Understand the architecture
4. **Plan Backend**: Review API integration points
5. **Start Building**: Add your custom features

## 💡 Pro Tips

- Use `Cmd+D` (iOS) or `Cmd+M` (Android) for dev menu
- Enable Fast Refresh for instant updates
- Use React DevTools for debugging
- Check console for errors and warnings
- Test on both iOS and Android

## 🎉 You're Ready!

The Rizzer app skeleton is fully functional. Start exploring, testing, and building amazing features!

**Happy Coding! 🚀**
