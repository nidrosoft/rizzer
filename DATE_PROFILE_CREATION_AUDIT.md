# 🔍 Date Profile Creation Flow - Complete Audit

## 📋 **Flow Overview**

**Total Steps:** 13  
**Store:** `useDateProfileCreationStore`  
**Database Tables:**
- `date_profiles` (main profile data)
- `date_profile_interests` (hobbies, favorites, personality)
- `date_profile_notes` (initial notes)

---

## ✅ **Step-by-Step Audit**

### **Step 1: Basic Info** (`/date-profile/basic-info.tsx`)
**Captured:**
- ✅ `first_name` → Saved to `draft.first_name`
- ✅ `last_name` → Saved to `draft.last_name`

**Database Mapping:**
- ✅ `first_name` → `date_profiles.first_name`
- ✅ `last_name` → `date_profiles.last_name`
- ✅ `name` → `date_profiles.name` (uses first_name or "Not sure")

**Status:** ✅ **WORKING**

---

### **Step 2: Date of Birth** (`/date-profile/date-of-birth.tsx`)
**Captured:**
- ✅ `date_of_birth` → Saved to `draft.date_of_birth`
- ✅ `age` → Calculated and saved to `draft.age`
- ✅ `zodiac_sign` → Calculated and saved to `draft.zodiac_sign`

**Database Mapping:**
- ✅ `date_of_birth` → `date_profiles.date_of_birth`
- ✅ `age` → `date_profiles.age`
- ✅ `zodiac_sign` → `date_profiles.zodiac_sign`

**Status:** ✅ **WORKING**

---

### **Step 3: Gender** (`/date-profile/gender.tsx`)
**Captured:**
- ✅ `gender` → Saved to `draft.gender`

**Database Mapping:**
- ✅ `gender` → `date_profiles.gender`

**Status:** ✅ **WORKING**

---

### **Step 4: Occupation** (`/date-profile/occupation.tsx`)
**Captured:**
- ✅ `occupation` → Saved to `draft.occupation`

**Database Mapping:**
- ✅ `occupation` → `date_profiles.occupation`

**Status:** ✅ **WORKING**

---

### **Step 5: Height** (`/date-profile/height.tsx`)
**Captured:**
- ✅ `height` → Saved to `draft.height` (in cm)

**Database Mapping:**
- ✅ `height` → `date_profiles.height`

**Status:** ✅ **WORKING**

---

### **Step 6: Location** (`/date-profile/location.tsx`)
**Captured:**
- ✅ `location` → Saved to `draft.location` (JSONB object)
  - city
  - state
  - country
  - latitude
  - longitude

**Database Mapping:**
- ✅ `location` → `date_profiles.location` (JSONB)

**Status:** ✅ **WORKING**

---

### **Step 7: Photo** (`/date-profile/photo.tsx`)
**Captured:**
- ✅ `primary_photo` → Saved to `draft.primary_photo`

**Database Mapping:**
- ✅ `primary_photo` → `date_profiles.primary_photo`

**Status:** ✅ **WORKING**

---

### **Step 8: Relationship Stage** (`/date-profile/relationship-stage.tsx`)
**Captured:**
- ✅ `relationship_stage` → Saved to `draft.relationship_stage`
  - Options: 'talking', 'dating', 'exclusive', 'engaged'

**Database Mapping:**
- ✅ `relationship_stage` → `date_profiles.relationship_stage`

**Status:** ✅ **WORKING**

---

### **Step 9: How We Met** (`/date-profile/how-met.tsx`)
**Captured:**
- ✅ `how_met` → Saved to `draft.how_met`

**Database Mapping:**
- ✅ `how_met` → `date_profiles.how_we_met`

**Status:** ✅ **WORKING**

---

### **Step 10: Love Language** (`/date-profile/love-language.tsx`)
**Captured:**
- ✅ `love_language` → Saved to `draft.love_language`

**Database Mapping:**
- ✅ `love_language` → `date_profiles.love_language`

**Status:** ✅ **WORKING**

---

### **Step 11: Interests** (`/date-profile/interests.tsx`) ⚠️
**Captured:**
- ✅ `hobbies` → Saved to `draft.hobbies` (flattened array)

**What's MISSING:**
- ❌ `favorite_color` → NOT captured
- ❌ `favorite_flower` → NOT captured
- ❌ `favorite_foods` → NOT captured
- ❌ `favorite_music` → NOT captured
- ❌ `dislikes` → NOT captured
- ❌ `personality_traits` → NOT captured

**Database Mapping:**
- ⚠️ `hobbies` → `date_profile_interests.hobbies`
- ❌ Other fields → NOT saved (all NULL)

**Status:** ⚠️ **PARTIALLY WORKING** - Only hobbies captured

**Issue:** The interests screen only captures hobbies from categories. It doesn't capture:
- Favorite color
- Favorite flower
- Favorite foods
- Favorite music
- Dislikes
- Personality traits

---

### **Step 12: Important Dates** (`/date-profile/important-dates.tsx`)
**Captured:**
- ✅ Important dates (anniversary, birthday, etc.)

**Database Mapping:**
- ✅ Saved to `date_profile_important_dates` table

**Status:** ✅ **WORKING**

---

### **Step 13: Notes** (`/date-profile/notes.tsx`)
**Captured:**
- ✅ `initial_notes` → Saved to `draft.initial_notes`

**Database Mapping:**
- ✅ `initial_notes` → `date_profile_notes.content`

**Status:** ✅ **WORKING**

---

## 🐛 **Critical Issues Found**

### **Issue #1: Interests Data Not Fully Captured** ⚠️

**Problem:**
The interests screen (`/date-profile/interests.tsx`) only captures hobbies. It doesn't capture:
- Favorite color
- Favorite flower
- Favorite foods
- Favorite music
- Dislikes
- Personality traits

**Current Code (Line 100-102):**
```typescript
const allInterests = Object.values(selectedInterests).flat();
updateDraft({ hobbies: allInterests });
await saveDraft();
```

**What's Missing:**
```typescript
// Should also capture:
updateDraft({
  hobbies: allInterests,
  favorite_color: selectedColor,
  favorite_flower: selectedFlower,
  favorite_foods: selectedFoods,
  favorite_music: selectedMusic,
  dislikes: selectedDislikes,
  personality_traits: selectedTraits,
});
```

---

### **Issue #2: Store Column Name Mismatch** ⚠️

**Problem:**
Store uses wrong column name when saving interests.

**Current Code (Line 214):**
```typescript
const interestsData = {
  profile_id: profileId,  // ❌ WRONG - should be date_profile_id
  hobbies: draft.hobbies || [],
  // ...
};
```

**Database Schema:**
```sql
CREATE TABLE date_profile_interests (
  id UUID PRIMARY KEY,
  date_profile_id UUID,  -- ✅ Correct column name
  hobbies TEXT[],
  favorite_color VARCHAR,
  -- ...
);
```

**Fix Required:**
```typescript
const interestsData = {
  date_profile_id: profileId,  // ✅ CORRECT
  hobbies: draft.hobbies || [],
  // ...
};
```

---

### **Issue #3: Interests Save Logic** ⚠️

**Problem:**
Store checks for wrong column when querying existing interests.

**Current Code (Line 228):**
```typescript
const { data: existingInterests } = await supabase
  .from('date_profile_interests')
  .select('id')
  .eq('profile_id', profileId)  // ❌ WRONG - should be date_profile_id
  .single();
```

**Fix Required:**
```typescript
const { data: existingInterests } = await supabase
  .from('date_profile_interests')
  .select('id')
  .eq('date_profile_id', profileId)  // ✅ CORRECT
  .single();
```

---

## 📊 **Data Capture Summary**

### **✅ Fully Captured (11/13 fields)**
1. ✅ Basic Info (first_name, last_name, name)
2. ✅ Date of Birth (date_of_birth, age, zodiac_sign)
3. ✅ Gender
4. ✅ Occupation
5. ✅ Height
6. ✅ Location (JSONB)
7. ✅ Photo (primary_photo)
8. ✅ Relationship Stage
9. ✅ How We Met
10. ✅ Love Language
11. ✅ Important Dates

### **⚠️ Partially Captured (1/13 fields)**
12. ⚠️ Interests (only hobbies, missing 6 other fields)

### **✅ Captured (1/13 fields)**
13. ✅ Initial Notes

---

## 🔧 **Required Fixes**

### **Fix #1: Update Interests Screen** (High Priority)
**File:** `/app/date-profile/interests.tsx`

**Add UI for:**
1. Favorite Color (color picker)
2. Favorite Flower (text input)
3. Favorite Foods (multi-select tags)
4. Favorite Music (multi-select tags)
5. Dislikes (multi-select tags)
6. Personality Traits (multi-select)

**Update save logic:**
```typescript
updateDraft({
  hobbies: allInterests,
  favorite_color: selectedColor,
  favorite_flower: selectedFlower,
  favorite_foods: selectedFoods,
  favorite_music: selectedMusic,
  dislikes: selectedDislikes,
  personality_traits: selectedTraits,
});
```

---

### **Fix #2: Fix Store Column Names** (Critical)
**File:** `/store/dateProfileCreationStore.ts`

**Line 214:** Change `profile_id` to `date_profile_id`
```typescript
const interestsData = {
  date_profile_id: profileId,  // ✅ Fixed
  hobbies: draft.hobbies || [],
  // ...
};
```

**Line 228:** Change `profile_id` to `date_profile_id`
```typescript
.eq('date_profile_id', profileId)  // ✅ Fixed
```

**Line 236:** Change `profile_id` to `date_profile_id`
```typescript
.eq('date_profile_id', profileId)  // ✅ Fixed
```

**Line 301:** Change `profile_id` to `date_profile_id`
```typescript
.eq('date_profile_id', profile.id)  // ✅ Fixed
```

---

### **Fix #3: Update Database Query** (Critical)
**File:** `/store/dateProfileCreationStore.ts`

**Line 249:** Change `profile_id` to `date_profile_id`
```typescript
await supabase
  .from('date_profile_notes')
  .insert({
    date_profile_id: profileId,  // ✅ Fixed (was profile_id)
    content: draft.initial_notes,
    // ...
  });
```

---

## 🎯 **Implementation Plan**

### **Phase 1: Critical Fixes** (30 mins)
1. ✅ Fix store column names (`profile_id` → `date_profile_id`)
2. ✅ Test profile creation
3. ✅ Verify interests save correctly

### **Phase 2: Enhanced Interests Screen** (90 mins)
1. Add favorite color picker
2. Add favorite flower input
3. Add favorite foods tags
4. Add favorite music tags
5. Add dislikes tags
6. Add personality traits selector
7. Update save logic
8. Test end-to-end

### **Phase 3: Display Updates** (30 mins)
1. Update InterestsCard to show all data
2. Test with real data
3. Verify UI displays correctly

---

## 📝 **Database Schema Reference**

### **date_profiles Table:**
```sql
- id (UUID)
- user_id (UUID)
- name (VARCHAR) ✅
- first_name (VARCHAR) ✅
- last_name (VARCHAR) ✅
- date_of_birth (DATE) ✅
- age (INTEGER) ✅
- zodiac_sign (VARCHAR) ✅
- gender (VARCHAR) ✅
- occupation (VARCHAR) ✅
- height (INTEGER) ✅
- location (JSONB) ✅
- primary_photo (TEXT) ✅
- relationship_stage (VARCHAR) ✅
- how_we_met (TEXT) ✅
- love_language (VARCHAR) ✅
- start_date (DATE) ✅
- status (VARCHAR) ✅
```

### **date_profile_interests Table:**
```sql
- id (UUID)
- date_profile_id (UUID) ⚠️ (store uses wrong name)
- hobbies (TEXT[]) ⚠️ (only this is captured)
- favorite_color (VARCHAR) ❌ (NOT captured)
- favorite_flower (VARCHAR) ❌ (NOT captured)
- favorite_foods (TEXT[]) ❌ (NOT captured)
- favorite_music (TEXT[]) ❌ (NOT captured)
- dislikes (TEXT[]) ❌ (NOT captured)
- personality_traits (TEXT[]) ❌ (NOT captured)
```

---

## ✅ **Recommended Action**

**Priority Order:**
1. **Fix store column names** (Critical - 10 mins)
2. **Test current flow** (10 mins)
3. **Enhance interests screen** (90 mins)
4. **Update display** (30 mins)

**Total Time:** ~2.5 hours

---

**Ready to implement fixes!**
