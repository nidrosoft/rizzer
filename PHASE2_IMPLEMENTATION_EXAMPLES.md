# Phase 2: Implementation Examples

## 🎯 **Real-World Usage Examples**

This guide shows you how to use the new state management and loading components in your existing screens.

---

## 1️⃣ **Update Authentication Screens**

### **Phone OTP Screen (`/app/auth/phone-otp.tsx`)**

**Before:**
```typescript
const [loading, setLoading] = useState(false);

const handleVerify = async () => {
  setLoading(true);
  try {
    // Manual API call
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    // Manual token storage
    await AsyncStorage.setItem('token', response.token);
    // Manual navigation
    router.push('/tabs');
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```typescript
import { useAuthStore } from '@/store';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';

const { login, isLoading } = useAuthStore();
const { showToast } = useToast();

const handleVerify = async () => {
  try {
    await login(phone, otp);
    // Token automatically saved, navigation handled by AuthProvider
    showToast('Login successful!', 'success');
  } catch (error: any) {
    showToast(error.message, 'error');
  }
};

// In render
if (isLoading) {
  return <LoadingSpinner fullScreen message="Verifying..." />;
}
```

---

## 2️⃣ **Update Home Screen**

### **Home Screen (`/app/tabs/index.tsx`)**

**Add Loading States:**

```typescript
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { CardSkeleton, ListSkeleton } from '@/components/ui';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dateIdeas, setDateIdeas] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load your data
      const ideas = await fetchDateIdeas();
      setDateIdeas(ideas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      {/* Header with user name */}
      <HomeHeader userName={user?.name || 'Guest'} />

      {/* Date Ideas Section */}
      <SectionHeader title="Date Ideas" />
      {loading ? (
        <>
          <CardSkeleton showImage lines={2} />
          <CardSkeleton showImage lines={2} />
          <CardSkeleton showImage lines={2} />
        </>
      ) : (
        dateIdeas.map(idea => (
          <DateIdeaCard key={idea.id} idea={idea} />
        ))
      )}
    </ScrollView>
  );
}
```

---

## 3️⃣ **Update Favorites**

### **Any Component with Favorites:**

**Before:**
```typescript
const [isFavorited, setIsFavorited] = useState(false);

useEffect(() => {
  checkFavorite();
}, []);

const checkFavorite = async () => {
  const favorites = await AsyncStorage.getItem('favorites');
  const parsed = favorites ? JSON.parse(favorites) : [];
  setIsFavorited(parsed.includes(itemId));
};

const toggleFavorite = async () => {
  const favorites = await AsyncStorage.getItem('favorites');
  const parsed = favorites ? JSON.parse(favorites) : [];
  
  if (isFavorited) {
    const filtered = parsed.filter(id => id !== itemId);
    await AsyncStorage.setItem('favorites', JSON.stringify(filtered));
    setIsFavorited(false);
  } else {
    parsed.push(itemId);
    await AsyncStorage.setItem('favorites', JSON.stringify(parsed));
    setIsFavorited(true);
  }
};
```

**After:**
```typescript
import { useUserStore } from '@/store';
import * as Haptics from 'expo-haptics';

const { isFavorite, addFavorite, removeFavorite } = useUserStore();
const favorited = isFavorite(itemId);

const toggleFavorite = async () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
  if (favorited) {
    await removeFavorite(itemId);
  } else {
    await addFavorite(itemId);
  }
};

// In render
<TouchableOpacity onPress={toggleFavorite}>
  <Heart 
    variant={favorited ? 'Bold' : 'Outline'} 
    color={favorited ? Colors.error : Colors.text}
  />
</TouchableOpacity>
```

---

## 4️⃣ **Update Settings Screen**

### **Settings Screen (`/app/home/settings.tsx`)**

**Add Theme & Notifications:**

```typescript
import { useAuthStore, useAppStore } from '@/store';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { 
    theme, 
    notificationsEnabled, 
    setTheme, 
    toggleNotifications 
  } = useAppStore();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation handled by AuthProvider
          },
        },
      ]
    );
  };

  return (
    <ScrollView>
      {/* User Info */}
      <View style={styles.userSection}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>

      {/* Notifications */}
      <View style={styles.setting}>
        <Text>Notifications</Text>
        <Switch 
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      {/* Theme */}
      <View style={styles.setting}>
        <Text>Dark Mode</Text>
        <Switch 
          value={theme === 'dark'}
          onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

---

## 5️⃣ **Update Profile Screen**

### **Profile Screen with Loading:**

```typescript
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { userAPI } from '@/services/api';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';

export default function ProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await userAPI.updateProfile({ name, bio });
      updateUser(updated);
      showToast('Profile updated!', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Saving..." />;
  }

  return (
    <ScrollView>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        multiline
      />
      <Button onPress={handleSave}>Save</Button>
    </ScrollView>
  );
}
```

---

## 6️⃣ **Update Discovery Screen**

### **Events List with Skeleton:**

```typescript
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store';
import { ListSkeleton } from '@/components/ui';

export default function EventsScreen() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const { rsvps, addRSVP, removeRSVP, isRSVP } = useUserStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (isRSVP(eventId)) {
      await removeRSVP(eventId);
    } else {
      await addRSVP(eventId);
    }
  };

  if (loading) {
    return <ListSkeleton count={5} showAvatar />;
  }

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => (
        <EventCard 
          event={item}
          isRSVP={isRSVP(item.id)}
          onRSVP={() => handleRSVP(item.id)}
        />
      )}
    />
  );
}
```

---

## 7️⃣ **Update Onboarding**

### **Onboarding Flow:**

```typescript
import { useAppStore } from '@/store';
import { useRouter } from 'expo-router';

export default function OnboardingCompleteScreen() {
  const { setOnboarded } = useAppStore();
  const router = useRouter();

  const handleComplete = async () => {
    await setOnboarded(true);
    // AuthProvider will handle navigation to tabs
  };

  return (
    <View>
      <Text>You're all set!</Text>
      <Button onPress={handleComplete}>Get Started</Button>
    </View>
  );
}
```

---

## 8️⃣ **Custom Hook Example**

### **Create useProfile Hook:**

```typescript
// /hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { userAPI } from '@/services/api';
import { errorLogger } from '@/services/logging/errorLogger';

export function useProfile() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profile = await userAPI.getProfile();
      updateUser(profile);
    } catch (err) {
      const error = err as Error;
      setError(error);
      errorLogger.error(error, { context: 'useProfile.refreshProfile' });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await userAPI.updateProfile(updates);
      updateUser(updated);
      return updated;
    } catch (err) {
      const error = err as Error;
      setError(error);
      errorLogger.error(error, { context: 'useProfile.updateProfile' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refreshProfile,
    updateProfile,
  };
}

// Usage
function ProfileScreen() {
  const { user, loading, updateProfile } = useProfile();

  const handleSave = async (data) => {
    try {
      await updateProfile(data);
      showToast('Saved!', 'success');
    } catch (error) {
      showToast('Failed to save', 'error');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  
  return <ProfileForm user={user} onSave={handleSave} />;
}
```

---

## 9️⃣ **Gift Investigation with Store**

### **Create Investigation:**

```typescript
import { useState } from 'react';
import { giftsAPI } from '@/services/api';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'expo-router';

export default function CreateInvestigationScreen() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const investigation = await giftsAPI.createInvestigation(formData);
      showToast('Investigation started!', 'success');
      router.push(`/gifts/investigation-detail?id=${investigation.id}`);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Creating investigation..." />;
  }

  return <InvestigationForm onSubmit={handleCreate} />;
}
```

---

## 🔟 **Pull to Refresh Example**

### **Add Pull to Refresh:**

```typescript
import { useState, useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={Colors.gradientStart}
        />
      }
    >
      {/* Your content */}
    </ScrollView>
  );
}
```

---

## 📊 **Performance Tips**

### **1. Use Selectors:**

```typescript
// ✅ GOOD - Only re-renders when user changes
const user = useAuthStore(selectUser);

// ❌ BAD - Re-renders on any auth state change
const { user } = useAuthStore();
```

### **2. Memoize Expensive Computations:**

```typescript
import { useMemo } from 'react';

const filteredEvents = useMemo(() => {
  return events.filter(event => 
    event.date > new Date() && 
    isRSVP(event.id)
  );
}, [events, rsvps]);
```

### **3. Use React.memo for Components:**

```typescript
import { memo } from 'react';

const EventCard = memo(({ event, onRSVP }) => {
  return (
    <TouchableOpacity onPress={onRSVP}>
      <Text>{event.title}</Text>
    </TouchableOpacity>
  );
});
```

---

## ✅ **Migration Checklist**

- [ ] Update auth screens to use `useAuthStore`
- [ ] Replace AsyncStorage with `useUserStore` for favorites
- [ ] Replace AsyncStorage with `useUserStore` for RSVPs
- [ ] Add loading states to all screens
- [ ] Use skeleton loaders for lists
- [ ] Update settings to use `useAppStore`
- [ ] Test login/logout flow
- [ ] Test navigation with AuthProvider
- [ ] Test state persistence
- [ ] Remove old useState/AsyncStorage code

---

**Ready to migrate your screens! 🚀**
