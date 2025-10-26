# 🎯 Interests & Preferences Implementation Plan

## 📊 **Current Situation Analysis**

### **Database Structure** ✅
**Table:** `date_profile_interests`

**Columns:**
```sql
- id (UUID)
- date_profile_id (UUID) → Foreign key to date_profiles
- hobbies (TEXT[]) → Array of hobby strings
- favorite_color (VARCHAR)
- favorite_flower (VARCHAR)
- favorite_foods (TEXT[]) → Array of food strings
- favorite_music (TEXT[]) → Array of music strings
- dislikes (TEXT[]) → Array of dislike strings
- personality_traits (TEXT[]) → Array of trait strings
- updated_at (TIMESTAMP)
```

### **Data Flow** ✅
1. **Date Profile Creation** → User selects interests from categories
2. **Stored in:** `date_profile_interests` table
3. **Fetched by:** `getDateProfileById()` function
4. **Transformed by:** `transformProfileData()` function
5. **Displayed in:** `InterestsCard` component

---

## 🔍 **Problem Identified**

### **Issue:**
The `InterestsCard` component shows "No interests added yet" even though data exists in the database.

### **Root Cause:**
The component expects `interests.hobbies` to be populated, but the data might not be:
1. **Not saved during profile creation** (creation flow issue)
2. **Not fetched properly** (query issue)
3. **Not transformed correctly** (data mapping issue)
4. **Empty in database** (no data was captured)

---

## 🔧 **Investigation Steps**

### **Step 1: Check Database** ✅
Query the database to see if interests data exists:

```sql
SELECT 
  dp.id,
  dp.name,
  dpi.hobbies,
  dpi.favorite_color,
  dpi.favorite_flower,
  dpi.favorite_foods,
  dpi.favorite_music,
  dpi.dislikes,
  dpi.personality_traits
FROM date_profiles dp
LEFT JOIN date_profile_interests dpi ON dp.id = dpi.date_profile_id
WHERE dp.user_id = '{current_user_id}';
```

**Expected Result:**
- If data exists → Fetching/display issue
- If data is NULL → Creation flow issue

---

### **Step 2: Check Profile Creation Flow**
**File to investigate:** Date profile creation screens

**Questions:**
1. Where is the interests selection screen?
2. Is `addProfileInterests()` being called after profile creation?
3. Are interests being passed correctly?

**Current Functions:**
```typescript
// Create profile
createDateProfile(userId, profileData)

// Add interests (separate call)
addProfileInterests(profileId, {
  hobbies: string[],
  favoriteColor: string,
  favoriteFlower: string,
  favoriteFoods: string[],
  favoriteMusic: string[],
  dislikes: string[],
  personalityTraits: string[]
})
```

---

### **Step 3: Check Data Fetching**
**File:** `/lib/dateProfiles.ts`

**Current Query:** ✅ Correct
```typescript
date_profile_interests (
  hobbies,
  favorite_color,
  favorite_flower,
  favorite_foods,
  favorite_music,
  dislikes,
  personality_traits
)
```

**Transform Function:** ✅ Correct
```typescript
interests: {
  hobbies: interestsData.hobbies || [],
  favoriteThings: {
    color: interestsData.favorite_color,
    flower: interestsData.favorite_flower,
    food: interestsData.favorite_foods || [],
    music: interestsData.favorite_music || [],
  },
  dislikes: interestsData.dislikes || [],
  personality: interestsData.personality_traits || [],
}
```

---

## 💡 **Recommended Solution**

### **Phase 1: Display Existing Data** (30 mins)
1. **Query database** to confirm data exists
2. **Update InterestsCard** to display ALL interest data:
   - Hobbies (organized by category)
   - Favorite color, flower, foods, music
   - Dislikes
   - Personality traits
3. **Test with real data**

### **Phase 2: Fix Creation Flow** (if needed) (45 mins)
1. **Find profile creation screens**
2. **Verify interests are being captured**
3. **Ensure `addProfileInterests()` is called**
4. **Test end-to-end flow**

### **Phase 3: Make It Editable** (60 mins)
1. **Create Edit Interests Modal**
2. **Multi-select for hobbies** (by category)
3. **Input fields for favorites**
4. **Save to database**
5. **Update UI immediately**

---

## 📋 **Detailed Implementation Plan**

### **Task 1: Enhanced InterestsCard Display**

**Update Component to Show:**

```typescript
// Current: Only shows hobbies
interests.hobbies

// New: Show everything
{
  hobbies: string[],           // Organized by category
  favoriteThings: {
    color: string,             // Display as colored circle
    flower: string,            // Display with flower emoji
    food: string[],            // Display as tags
    music: string[],           // Display as tags
  },
  dislikes: string[],          // Display as tags (red theme)
  personality: string[],       // Display as tags (purple theme)
}
```

**UI Layout:**
```
┌─────────────────────────────────────┐
│ ❤️ Interests & Preferences      [✏️] │
├─────────────────────────────────────┤
│ Activities                          │
│ [Dancing] [Yoga] [Hiking]          │
│                                     │
│ Food & Drink                        │
│ [Cooking] [Wine tasting]           │
│                                     │
│ Favorites                           │
│ 🎨 Color: Blue ●                   │
│ 🌸 Flower: Rose                    │
│ 🍕 Food: [Pizza] [Sushi]           │
│ 🎵 Music: [Jazz] [Pop]             │
│                                     │
│ Personality                         │
│ [Outgoing] [Creative] [Adventurous]│
│                                     │
│ Dislikes                            │
│ [Spiders] [Cold weather]           │
└─────────────────────────────────────┘
```

---

### **Task 2: Edit Interests Modal**

**Modal Structure:**
```
┌─────────────────────────────────────┐
│ ← Edit Interests                  ✕ │
├─────────────────────────────────────┤
│ [Hobbies Tab] [Favorites Tab]       │
├─────────────────────────────────────┤
│                                     │
│ Hobbies Tab:                        │
│ - Categories (expandable)           │
│ - Multi-select checkboxes           │
│ - Search bar                        │
│                                     │
│ Favorites Tab:                      │
│ - Color picker                      │
│ - Flower input                      │
│ - Food tags (add/remove)            │
│ - Music tags (add/remove)           │
│ - Personality traits (multi-select) │
│ - Dislikes (add/remove)             │
│                                     │
│ [Cancel]              [Save Changes]│
└─────────────────────────────────────┘
```

**Functions Needed:**
```typescript
// Update interests
updateProfileInterests(profileId, interests)

// Already exists in dateProfiles.ts ✅
```

---

### **Task 3: Database Verification**

**Check if data exists:**
```sql
-- Run this query
SELECT * FROM date_profile_interests 
WHERE date_profile_id = '{profile_id}';
```

**Possible Outcomes:**
1. **Data exists** → Display issue (fix InterestsCard)
2. **No data** → Creation issue (fix creation flow)
3. **Partial data** → Both issues (fix both)

---

## 🎯 **Priority Order**

### **High Priority** (Do First)
1. ✅ Query database to check if data exists
2. ✅ Update InterestsCard to display ALL data
3. ✅ Test with real profile

### **Medium Priority** (Do Second)
4. Find and fix profile creation flow
5. Ensure interests are being saved

### **Low Priority** (Do Last)
6. Create edit modal
7. Implement save functionality

---

## 📝 **Files to Modify**

### **1. InterestsCard Component**
**File:** `/components/date-profile/InterestsCardNew.tsx`

**Changes:**
- Display favorite color (with colored circle)
- Display favorite flower (with emoji)
- Display favorite foods (as tags)
- Display favorite music (as tags)
- Display personality traits (as tags)
- Display dislikes (as tags with red theme)

### **2. Date Profile Screen**
**File:** `/app/date-profile/[id].tsx`

**Changes:**
- Pass full interests object to InterestsCard
- Add edit handler for modal

### **3. Edit Interests Modal** (New File)
**File:** `/components/date-profile/EditInterestsModal.tsx`

**Features:**
- Tabbed interface (Hobbies / Favorites)
- Multi-select for hobbies
- Input fields for favorites
- Save button
- Cancel button

---

## ✅ **Success Criteria**

### **Phase 1: Display**
- [ ] All interests data visible in card
- [ ] Hobbies organized by category
- [ ] Favorites displayed with icons
- [ ] Personality traits visible
- [ ] Dislikes visible
- [ ] Empty state if no data

### **Phase 2: Edit**
- [ ] Edit button opens modal
- [ ] Can select/deselect hobbies
- [ ] Can edit favorites
- [ ] Can add/remove tags
- [ ] Save updates database
- [ ] UI updates immediately

---

## 🚀 **Next Steps**

**Immediate Actions:**
1. Run database query to check data
2. Update InterestsCard component
3. Test with real profile
4. Report findings

**After Verification:**
- If data exists → Focus on display
- If no data → Fix creation flow
- Then implement edit functionality

---

## 📊 **Data Structure Reference**

### **Database (date_profile_interests):**
```typescript
{
  hobbies: string[],              // ["Dancing", "Yoga", "Hiking"]
  favorite_color: string,         // "Blue"
  favorite_flower: string,        // "Rose"
  favorite_foods: string[],       // ["Pizza", "Sushi"]
  favorite_music: string[],       // ["Jazz", "Pop"]
  dislikes: string[],             // ["Spiders", "Cold weather"]
  personality_traits: string[],   // ["Outgoing", "Creative"]
}
```

### **App (DateProfileData.interests):**
```typescript
{
  hobbies: string[],
  favoriteThings: {
    color: string,
    flower: string,
    food: string[],
    music: string[],
  },
  dislikes: string[],
  personality: string[],
}
```

---

## 🎨 **Design Specs**

### **Tags:**
- **Hobbies:** Pink theme (`rgba(255, 107, 157, 0.1)`)
- **Favorites:** Purple theme (`rgba(139, 92, 246, 0.1)`)
- **Personality:** Blue theme (`rgba(59, 130, 246, 0.1)`)
- **Dislikes:** Red theme (`rgba(239, 68, 68, 0.1)`)

### **Icons:**
- 🎨 Color (with colored circle preview)
- 🌸 Flower
- 🍕 Food
- 🎵 Music
- ✨ Personality
- ❌ Dislikes

---

**Ready to proceed with database verification and implementation!**
