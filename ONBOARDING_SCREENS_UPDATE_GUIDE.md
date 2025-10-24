# 📋 ONBOARDING SCREENS UPDATE GUIDE

## **Quick Reference for Updating All Screens**

This guide shows exactly what to change in each onboarding screen to connect it to Supabase.

---

## ✅ **COMPLETED SCREENS:**
1. ✅ name.tsx - Step 1
2. ✅ dateOfBirth.tsx - Step 2
3. ✅ gender.tsx - Step 3

---

## 🔄 **SCREENS TO UPDATE:**

### **4. height.tsx - Step 4**
```typescript
// Add import
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { ActivityIndicator } from 'react-native';

// Add hook (replace handleContinue)
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 4,
  nextRoute: '/onboarding/ethnicity',
  validateData: () => height > 0,
  getDataToSave: () => ({ height }), // height in cm
});

// Update button
<TouchableOpacity
  onPress={saveAndContinue}
  disabled={!isValid || isSaving}
>
  {isSaving ? <ActivityIndicator /> : <ArrowRight />}
</TouchableOpacity>
```

---

### **5. ethnicity.tsx - Step 5**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 5,
  nextRoute: '/onboarding/religion',
  validateData: () => selectedEthnicity !== '',
  getDataToSave: () => ({ ethnicity: selectedEthnicity }),
});
```

---

### **6. religion.tsx - Step 6**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 6,
  nextRoute: '/onboarding/zodiacSign',
  validateData: () => selectedReligion !== '',
  getDataToSave: () => ({ religion: selectedReligion }),
});
```

---

### **7. zodiacSign.tsx - Step 7**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 7,
  nextRoute: '/onboarding/drinking',
  validateData: () => selectedSign !== '',
  getDataToSave: () => ({ zodiacSign: selectedSign }),
});
```

---

### **8. drinking.tsx - Step 8**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 8,
  nextRoute: '/onboarding/occupation',
  validateData: () => selectedOption !== '',
  getDataToSave: () => ({ drinking: selectedOption }),
});
```

---

### **9. occupation.tsx - Step 9**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 9,
  nextRoute: '/onboarding/bio',
  validateData: () => occupation.trim().length > 0,
  getDataToSave: () => ({ occupation: occupation.trim() }),
});
```

---

### **10. bio.tsx - Step 10**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 10,
  nextRoute: '/onboarding/interests',
  validateData: () => bio.trim().length >= 10,
  getDataToSave: () => ({ bio: bio.trim() }),
});
```

---

### **11. interests.tsx - Step 11**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 11,
  nextRoute: '/onboarding/photos',
  validateData: () => selectedInterests.length >= 3,
  getDataToSave: () => ({ interests: selectedInterests }),
});
```

---

### **12. photos.tsx - Step 12** ⚠️ **SPECIAL - Needs Photo Upload**
```typescript
import { pickImageFromGallery, uploadPhoto } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';

const [photos, setPhotos] = useState<string[]>([]);
const [uploading, setUploading] = useState(false);
const user = useAuthStore((state) => state.user);

const handleAddPhoto = async () => {
  const result = await pickImageFromGallery();
  
  if (result.success && result.uri) {
    setUploading(true);
    const upload = await uploadPhoto(result.uri, user!.id);
    
    if (upload.success && upload.url) {
      setPhotos([...photos, upload.url]);
    } else {
      Alert.alert('Error', upload.error);
    }
    setUploading(false);
  }
};

const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 12,
  nextRoute: '/onboarding/location',
  validateData: () => photos.length >= 2,
  getDataToSave: () => ({ photos }),
});
```

---

### **13. location.tsx - Step 13** ⚠️ **SPECIAL - Needs Location API**
```typescript
import * as Location from 'expo-location';

const [location, setLocation] = useState<{
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}>({});

const requestLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  const loc = await Location.getCurrentPositionAsync({});
  const [address] = await Location.reverseGeocodeAsync({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  });

  setLocation({
    city: address.city || undefined,
    state: address.region || undefined,
    country: address.country || undefined,
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  });
};

const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 13,
  nextRoute: '/onboarding/lookingFor',
  validateData: () => !!location.city,
  getDataToSave: () => ({ location }),
});
```

---

### **14. lookingFor.tsx - Step 14**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 14,
  nextRoute: '/onboarding/relationshipType',
  validateData: () => selected !== '',
  getDataToSave: () => ({ lookingFor: selected }),
});
```

---

### **15. relationshipType.tsx - Step 15**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 15,
  nextRoute: '/onboarding/primaryGoal',
  validateData: () => selected !== '',
  getDataToSave: () => ({ relationshipType: selected }),
});
```

---

### **16. primaryGoal.tsx - Step 16**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: 16,
  nextRoute: '/onboarding/setup-loading',
  validateData: () => selected !== '',
  getDataToSave: () => ({ primaryGoal: selected }),
});
```

---

## 🎯 **STANDARD PATTERN:**

For most screens, follow this 3-step pattern:

### **Step 1: Add Imports**
```typescript
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { ActivityIndicator } from 'react-native';
```

### **Step 2: Add Hook**
```typescript
const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
  stepNumber: X, // Current step number
  nextRoute: '/onboarding/next-screen',
  validateData: () => /* validation logic */,
  getDataToSave: () => ({ fieldName: value }),
});
```

### **Step 3: Update Button**
```typescript
<TouchableOpacity
  onPress={saveAndContinue}
  disabled={!isValid || isSaving}
>
  {isSaving ? (
    <ActivityIndicator color={Colors.background} />
  ) : (
    <ArrowRight size={28} color={isValid ? Colors.background : Colors.border} />
  )}
</TouchableOpacity>
```

---

## ⚠️ **SPECIAL CASES:**

### **Photos Screen (Step 12):**
- Needs photo upload UI
- Use `pickImageFromGallery()` and `uploadPhoto()`
- Show upload progress
- Min 2 photos required

### **Location Screen (Step 13):**
- Needs location permissions
- Use Expo Location API
- Reverse geocode to get city/state
- Save as JSON object

---

## 📦 **REQUIRED PACKAGES:**

```bash
# Already installed
npm install expo-image-picker expo-image-manipulator

# Need to install
npm install expo-location
```

---

## ✅ **TESTING CHECKLIST:**

After updating each screen:
- [ ] Import hook correctly
- [ ] stepNumber matches screen order
- [ ] nextRoute points to correct screen
- [ ] Validation logic works
- [ ] Data field name matches database column
- [ ] Button shows loading state
- [ ] Button disabled while saving
- [ ] Test save to database
- [ ] Check database for saved data

---

## 🚀 **ESTIMATED TIME:**

- Simple screens (5-15): ~5 minutes each
- Photos screen: ~30 minutes
- Location screen: ~20 minutes
- **Total: ~2 hours**

---

**Use this guide to update all remaining screens systematically!**
