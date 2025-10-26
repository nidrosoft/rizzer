# 🎨 Date Profile Enhancements - Implementation Plan

## ✅ **Data Capture Verification**

### **Database Check Results:**
```json
{
  "name": "Amena",
  "first_name": "Amena",
  "age": 24,
  "gender": "female",
  "occupation": "Real Estate",
  "height": 173,
  "love_language": "words_of_affirmation",  ✅ CAPTURED
  "relationship_stage": "Talking",
  "zodiac_sign": "Capricorn",
  "primary_photo": "...",
  "location": { "city": "La Mesa" }
}
```

**Status:** ✅ **ALL DATA IS BEING CAPTURED CORRECTLY**

**Captured Fields:**
- ✅ Basic Info (name, first_name, last_name)
- ✅ Personal Details (age, gender, occupation, height)
- ✅ Relationship Info (relationship_stage, love_language, zodiac_sign)
- ✅ Location (city, state, country)
- ✅ Photo (primary_photo)
- ✅ Interests (hobbies array)

**Where to Display:**
1. **Overview Card** - Basic info, stats
2. **Interests Card** - Hobbies, favorites ✅ (already done)
3. **Details Section** - Love language, zodiac, height, occupation
4. **Location Card** - City, state, country
5. **Relationship Timeline** - Stage, how we met, start date

---

## 🎨 **Enhancement #1: Colorful Interest Badges**

### **Current State:**
- All badges use same pink color: `rgba(255, 107, 157, 0.1)`
- Looks monotonous and bland

### **New Design:**
**7 Soft Pastel Colors** (one per category)

```typescript
const CATEGORY_COLORS = {
  Activities: {
    bg: 'rgba(139, 92, 246, 0.1)',    // Soft Purple
    border: 'rgba(139, 92, 246, 0.2)',
    text: '#7C3AED',
  },
  'Food & Drink': {
    bg: 'rgba(251, 146, 60, 0.1)',    // Soft Orange
    border: 'rgba(251, 146, 60, 0.2)',
    text: '#EA580C',
  },
  Entertainment: {
    bg: 'rgba(236, 72, 153, 0.1)',    // Soft Pink
    border: 'rgba(236, 72, 153, 0.2)',
    text: '#DB2777',
  },
  Music: {
    bg: 'rgba(59, 130, 246, 0.1)',    // Soft Blue
    border: 'rgba(59, 130, 246, 0.2)',
    text: '#2563EB',
  },
  Sports: {
    bg: 'rgba(34, 197, 94, 0.1)',     // Soft Green
    border: 'rgba(34, 197, 94, 0.2)',
    text: '#16A34A',
  },
  Creative: {
    bg: 'rgba(168, 85, 247, 0.1)',    // Soft Violet
    border: 'rgba(168, 85, 247, 0.2)',
    text: '#9333EA',
  },
  Lifestyle: {
    bg: 'rgba(14, 165, 233, 0.1)',    // Soft Cyan
    border: 'rgba(14, 165, 233, 0.2)',
    text: '#0284C7',
  },
};
```

### **Visual Preview:**
```
Activities:     [Dancing]  [Yoga]  [Hiking]      (Purple)
Food & Drink:   [Coffee]  [Cooking]  [Foodie]    (Orange)
Entertainment:  [Movies]  [Gaming]  [Comedy]     (Pink)
Music:          [Rock]  [Classical]  [Pop]       (Blue)
Sports:         [Football]  [Running]  [Soccer]  (Green)
Creative:       [Photography]  [Drawing]         (Violet)
Lifestyle:      [Pets]  [Meditation]  [Travel]   (Cyan)
```

### **Implementation:**
**File:** `/components/date-profile/InterestsCardNew.tsx`

**Changes:**
1. Add `CATEGORY_COLORS` constant
2. Update `tag` style to use dynamic colors
3. Pass category name to determine color

**Code:**
```typescript
// Get color for category
const getCategoryColor = (hobby: string) => {
  for (const [categoryName, categoryData] of Object.entries(INTEREST_CATEGORIES)) {
    if (categoryData.interests.includes(hobby)) {
      return CATEGORY_COLORS[categoryName];
    }
  }
  return CATEGORY_COLORS.Activities; // Default
};

// Render tag with color
<View style={[
  styles.tag,
  {
    backgroundColor: color.bg,
    borderColor: color.border,
  }
]}>
  <Text style={[styles.tagText, { color: color.text }]}>
    {hobby}
  </Text>
</View>
```

**Time:** 20 minutes

---

## 📸 **Enhancement #2: Edit Photo Functionality**

### **Current State:**
- Photo displayed in header
- No way to update photo

### **New Design:**
**Edit Button** - Pencil icon in top-right corner of photo

```
┌─────────────────────────────────┐
│  ┌─────────────────┐            │
│  │                 │  [✏️]      │ ← Edit button
│  │     Photo       │            │
│  │                 │            │
│  └─────────────────┘            │
│  Amena, 24                      │
└─────────────────────────────────┘
```

### **Bottom Sheet Modal:**
```
┌─────────────────────────────────┐
│ Edit Photo                    ✕ │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │   Current Photo         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  [📷 Take Photo]                │
│  [🖼️ Choose from Gallery]       │
│  [🗑️ Remove Photo]              │
│                                 │
│  [Cancel]          [Save]       │
└─────────────────────────────────┘
```

### **Implementation:**

**1. Create Component:** `/components/date-profile/EditPhotoModal.tsx`
```typescript
interface EditPhotoModalProps {
  visible: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onSave: (photoUri: string) => void;
  profileId: string;
}

export default function EditPhotoModal({
  visible,
  onClose,
  currentPhoto,
  onSave,
  profileId
}: EditPhotoModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(currentPhoto);
  
  const handleTakePhoto = async () => {
    // Use expo-image-picker camera
  };
  
  const handleChoosePhoto = async () => {
    // Use expo-image-picker gallery
  };
  
  const handleRemovePhoto = () => {
    setSelectedPhoto(undefined);
  };
  
  const handleSave = async () => {
    // Upload to Supabase storage
    // Update date_profiles.primary_photo
    onSave(selectedPhoto);
    onClose();
  };
  
  return (
    <Modal visible={visible} animationType="slide">
      {/* UI */}
    </Modal>
  );
}
```

**2. Update Date Profile Screen:** `/app/date-profile/[id].tsx`
```typescript
const [showEditPhoto, setShowEditPhoto] = useState(false);

const handleSavePhoto = async (photoUri: string) => {
  // Update database
  const { error } = await supabase
    .from('date_profiles')
    .update({ primary_photo: photoUri })
    .eq('id', profileId);
    
  if (!error) {
    // Update local state
    setProfile({ ...profile, basicInfo: { ...profile.basicInfo, photo: photoUri } });
  }
};
```

**3. Add Edit Button to Photo:**
```typescript
<View style={styles.photoContainer}>
  <Image source={{ uri: photo }} style={styles.photo} />
  <TouchableOpacity 
    style={styles.editPhotoButton}
    onPress={() => setShowEditPhoto(true)}
  >
    <Edit2 size={16} color={Colors.text} />
  </TouchableOpacity>
</View>
```

**Time:** 60 minutes

---

## ✏️ **Enhancement #3: Edit Interests Functionality**

### **Current State:**
- Interests displayed as read-only badges
- Edit button exists but doesn't work

### **New Design:**
**Edit Modal** - Full-screen modal with add/remove functionality

```
┌─────────────────────────────────┐
│ ← Edit Interests              ✕ │
├─────────────────────────────────┤
│ 🔍 Search interests...          │
├─────────────────────────────────┤
│                                 │
│ Activities ▼                    │
│ ☑ Dancing  ☑ Yoga  ☐ Hiking    │
│ ☑ Rock climbing  ☐ Cycling     │
│                                 │
│ Food & Drink ▼                  │
│ ☑ Coffee  ☑ Cooking  ☐ Baking  │
│                                 │
│ Entertainment ▼                 │
│ ☑ Movies  ☑ Gaming  ☐ Theater  │
│                                 │
│ [Show more categories...]       │
│                                 │
├─────────────────────────────────┤
│ Selected (15)                   │
│ [Dancing] [Yoga] [Coffee] ...   │
├─────────────────────────────────┤
│ [Cancel]              [Save]    │
└─────────────────────────────────┘
```

### **Implementation:**

**1. Create Component:** `/components/date-profile/EditInterestsModal.tsx`
```typescript
interface EditInterestsModalProps {
  visible: boolean;
  onClose: () => void;
  currentInterests: string[];
  onSave: (interests: string[]) => void;
  profileId: string;
}

export default function EditInterestsModal({
  visible,
  onClose,
  currentInterests,
  onSave,
  profileId
}: EditInterestsModalProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('');
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleSave = async () => {
    // Update database
    const { error } = await supabase
      .from('date_profile_interests')
      .update({ hobbies: selectedInterests })
      .eq('date_profile_id', profileId);
      
    if (!error) {
      onSave(selectedInterests);
      onClose();
    }
  };
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      {/* Header */}
      {/* Search bar */}
      {/* Expandable categories */}
      {/* Selected interests preview */}
      {/* Save/Cancel buttons */}
    </Modal>
  );
}
```

**2. Wire Up in InterestsCard:**
```typescript
const handleEdit = () => {
  setShowEditInterests(true);
};

const handleSaveInterests = (newInterests: string[]) => {
  setProfile({
    ...profile,
    interests: {
      ...profile.interests,
      hobbies: newInterests,
    },
  });
};

<EditInterestsModal
  visible={showEditInterests}
  onClose={() => setShowEditInterests(false)}
  currentInterests={interests.hobbies}
  onSave={handleSaveInterests}
  profileId={profile.id}
/>
```

**Time:** 90 minutes

---

## 📊 **Enhancement #4: Display Love Language & Other Data**

### **Where to Display:**

**1. Overview Card** (already exists)
- Days together, dates, memories ✅

**2. Details Card** (NEW)
```
┌─────────────────────────────────┐
│ 💝 Details                  [✏️]│
├─────────────────────────────────┤
│ Love Language                   │
│ Words of Affirmation            │
│                                 │
│ Zodiac Sign                     │
│ ♑ Capricorn                    │
│                                 │
│ Height                          │
│ 5'8" (173 cm)                   │
│                                 │
│ Occupation                      │
│ Real Estate                     │
│                                 │
│ Location                        │
│ 📍 La Mesa                      │
└─────────────────────────────────┘
```

**3. Relationship Card** (NEW)
```
┌─────────────────────────────────┐
│ 💕 Relationship             [✏️]│
├─────────────────────────────────┤
│ Status                          │
│ Talking                         │
│                                 │
│ How We Met                      │
│ Through mutual friends...       │
│                                 │
│ Started Dating                  │
│ January 15, 2024                │
└─────────────────────────────────┘
```

### **Implementation:**

**1. Create DetailsCard:** `/components/date-profile/DetailsCard.tsx`
```typescript
interface DetailsCardProps {
  loveLanguage?: string;
  zodiacSign?: string;
  height?: number;
  occupation?: string;
  location?: { city?: string; state?: string };
  onEdit: () => void;
}

export default function DetailsCard({
  loveLanguage,
  zodiacSign,
  height,
  occupation,
  location,
  onEdit
}: DetailsCardProps) {
  const formatHeight = (cm: number) => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${feet}'${inches}" (${cm} cm)`;
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>💝 Details</Text>
        <TouchableOpacity onPress={onEdit}>
          <Edit2 size={18} color={Colors.purple} />
        </TouchableOpacity>
      </View>
      
      {/* Love Language */}
      {loveLanguage && (
        <View style={styles.row}>
          <Text style={styles.label}>Love Language</Text>
          <Text style={styles.value}>{formatLoveLanguage(loveLanguage)}</Text>
        </View>
      )}
      
      {/* Zodiac */}
      {/* Height */}
      {/* Occupation */}
      {/* Location */}
    </View>
  );
}
```

**2. Add to Date Profile Screen:**
```typescript
<DetailsCard
  loveLanguage={profile.basicInfo.loveLanguage}
  zodiacSign={profile.basicInfo.zodiacSign}
  height={profile.basicInfo.height}
  occupation={profile.basicInfo.occupation}
  location={profile.basicInfo.location}
  onEdit={() => setShowEditDetails(true)}
/>
```

**Time:** 45 minutes

---

## 📋 **Complete Implementation Plan**

### **Phase 1: Visual Improvements** (20 mins)
✅ Add colorful badges to interests
- 7 soft pastel colors
- One color per category
- Dynamic color assignment

### **Phase 2: Edit Photo** (60 mins)
✅ Create EditPhotoModal component
✅ Add edit button to photo
✅ Implement camera/gallery picker
✅ Upload to Supabase storage
✅ Update database

### **Phase 3: Edit Interests** (90 mins)
✅ Create EditInterestsModal component
✅ Expandable categories
✅ Search functionality
✅ Add/remove interests
✅ Update database
✅ Refresh UI

### **Phase 4: Display Additional Data** (45 mins)
✅ Create DetailsCard component
✅ Display love language
✅ Display zodiac, height, occupation
✅ Display location
✅ Add edit functionality

### **Phase 5: Testing** (30 mins)
✅ Test photo upload
✅ Test interests edit
✅ Test details display
✅ Test all edit modals
✅ Verify database updates

**Total Time:** ~4 hours

---

## 🎨 **Color Palette Reference**

```typescript
// Soft Pastel Colors for Interest Categories
const COLORS = {
  purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', text: '#7C3AED' },
  orange: { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.2)', text: '#EA580C' },
  pink: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.2)', text: '#DB2777' },
  blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#2563EB' },
  green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', text: '#16A34A' },
  violet: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)', text: '#9333EA' },
  cyan: { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgba(14, 165, 233, 0.2)', text: '#0284C7' },
};
```

---

## ✅ **Priority Order**

**High Priority** (Do First):
1. ✅ Colorful badges (20 mins) - Quick visual win
2. ✅ Edit interests modal (90 mins) - Most requested feature

**Medium Priority** (Do Second):
3. ✅ Display additional data (45 mins) - Show all captured data
4. ✅ Edit photo (60 mins) - Important but less urgent

**Low Priority** (Do Last):
5. ✅ Testing (30 mins) - Verify everything works

---

## 🚀 **Ready to Implement!**

**Recommended Start:**
1. **Colorful badges** - Quick visual improvement
2. **Edit interests** - Core functionality
3. **Display data** - Show love language, etc.
4. **Edit photo** - Complete the experience

**Should I start with colorful badges?** 🎨
