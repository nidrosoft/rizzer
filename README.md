# Rizzer - AI-Powered Dating Coach App

A comprehensive React Native mobile application built with Expo SDK 54, featuring an AI-powered dating coach that helps users improve their dating skills, manage connections, and discover relevant content and events.

## 🚀 Features

### Core Features
- **AI-Powered Rizz Generation**: Get smart conversation starters and dating advice
- **Date Management**: Track and manage all your dating connections
- **Event Discovery**: Find local dating events and activities
- **Personalized Tips**: Daily dating tips and trending topics
- **Beautiful UI**: Bumble-inspired design with purple gradients and modern aesthetics

### App Sections

#### 1. Authentication Flow
- Welcome screen with social login options
- Sign up / Sign in with email
- Phone verification with OTP
- Smooth animations and transitions

#### 2. Onboarding Flow (12 Steps)
- Name
- Date of Birth
- Zodiac Sign
- Primary Goal
- Location
- Gender Identity
- Looking For
- Height
- Interests
- Photos Upload
- Bio
- Complete profile setup

#### 3. Main App (Tab Navigation)
- **Home**: Dashboard with quick actions, rizz collection, dates, events, and premium upgrade
- **Rizz**: Two tabs - "My Rizz" (saved rizz lines) and "Generate Rizz" (AI chat interface)
- **Dates**: Manage dating connections with profiles, stats, and quick actions
- **Discovery**: Daily tips, trending topics, upcoming events, and top community rizz

## 🛠 Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **UI Components**: Custom components with Bumble-inspired theming
- **Animations**: React Native Reanimated 3
- **Styling**: StyleSheet with custom theme system
- **Icons**: Emoji-based icon system
- **Special Features**: Expo Glass Effect (iOS 18+ Liquid Glass support)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Setup Instructions

1. **Clone or navigate to the project directory**
```bash
cd /Users/blackpanther/Desktop/Rizzers
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on specific platform**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Project Structure

```
Rizzers/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Splash screen
│   ├── auth/                    # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Welcome screen
│   │   ├── signup.tsx
│   │   ├── signin.tsx
│   │   ├── phone.tsx
│   │   └── otp.tsx
│   ├── onboarding/              # Onboarding flow
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Welcome
│   │   ├── name.tsx
│   │   ├── dateOfBirth.tsx
│   │   ├── zodiacSign.tsx
│   │   ├── primaryGoal.tsx
│   │   ├── location.tsx
│   │   ├── gender.tsx
│   │   ├── lookingFor.tsx
│   │   ├── height.tsx
│   │   ├── interests.tsx
│   │   ├── photos.tsx
│   │   └── bio.tsx
│   └── tabs/                    # Main app tabs
│       ├── _layout.tsx
│       ├── index.tsx            # Home
│       ├── rizz.tsx             # Rizz screen
│       ├── dates.tsx            # Dates screen
│       └── discovery.tsx        # Discovery screen
├── components/                   # Reusable components
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── OnboardingScreen.tsx
│   ├── forms/
│   │   └── Input.tsx
│   └── cards/                   # (To be added)
├── constants/                    # App constants
│   ├── theme.ts                 # Colors, spacing, fonts
│   └── types.ts                 # TypeScript types
├── hooks/                        # Custom hooks (To be added)
├── services/                     # API services (To be added)
├── store/                        # State management (To be added)
├── assets/                       # Images, fonts, icons
├── app.json                      # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: `#FFD700` (Bumble Yellow)
- **Purple**: `#6C63FF` to `#9C27B0` (Gradient)
- **Background**: `#FFFFFF`
- **Text**: `#1A1A1A`
- **Secondary Text**: `#6B7280`

### Typography
- Font weights: 300 (light) to 800 (extrabold)
- Font sizes: 12px to 48px

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border Radius
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript with:
- JSX: react-native
- ES Module Interop enabled
- Path aliases: `@/*` maps to project root

### Expo Configuration (app.json)
- **Name**: Rizzer
- **Slug**: rizzer
- **SDK**: 54
- **New Architecture**: Enabled
- **Scheme**: rizzer
- **Typed Routes**: Enabled

## 📱 Screen Flow

```
Splash (2s)
  ↓
Auth Welcome
  ↓
Sign Up / Sign In
  ↓
Phone Verification
  ↓
OTP Verification
  ↓
Onboarding (12 steps)
  ↓
Main App (Tabs)
  ├── Home
  ├── Rizz
  ├── Dates
  └── Discovery
```

## 🎯 Next Steps (To Be Implemented)

### Backend Integration
- [ ] Set up Supabase database
- [ ] Implement authentication with Supabase Auth
- [ ] Create API endpoints for CRUD operations
- [ ] Integrate OpenAI API for Rizz generation

### State Management
- [ ] Set up Zustand stores
- [ ] Implement user state management
- [ ] Add persistent storage with AsyncStorage
- [ ] Create API service layer

### Additional Features
- [ ] Settings screen
- [ ] Profile editing
- [ ] Premium subscription flow
- [ ] Push notifications
- [ ] Image upload functionality
- [ ] Real-time chat
- [ ] Event booking
- [ ] Analytics dashboard

### UI Enhancements
- [ ] Add Lottie animations
- [ ] Implement skeleton loaders
- [ ] Add pull-to-refresh
- [ ] Implement infinite scroll
- [ ] Add haptic feedback
- [ ] Dark mode support

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests with Detox
- [ ] Performance optimization

## 🚀 Deployment

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## 📄 License

This project is private and proprietary.

## 👥 Team

Built with ❤️ for the dating community

## 📞 Support

For support, please contact the development team.

---

**Note**: This is a skeleton/prototype version. Backend integration and advanced features are planned for future iterations.
