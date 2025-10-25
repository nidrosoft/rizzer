# Date Profile Implementation Plan

## Overview
Implementing a complete date profile creation flow where users can create profiles for people they're dating. This is a dating coach/wingman app, not a dating app - it helps users remember important details about people they care about.

## Current Status ✅

### Existing Database Structure
**Table:** `date_profiles` (ALREADY EXISTS)

**Related Tables:**
- `date_profile_photos` - Photo gallery
- `date_profile_interests` - Hobbies, favorites, dislikes
- `date_profile_notes` - Quick notes and reminders
- `date_profile_dates` - Past dates/outings
- `date_profile_memories` - Special memories
- `date_profile_important_dates` - Birthdays, anniversaries

### Existing Flow (Partially Built)
1. ✅ Basic Info (name, age) - `/app/date-profile/basic-info.tsx`
2. ✅ Location - `/app/date-profile/location.tsx`
3. ✅ Photo - `/app/date-profile/photo.tsx`
4. ✅ Relationship Stage - `/app/date-profile/relationship-stage.tsx`
5. ✅ How Met - `/app/date-profile/how-met.tsx`
6. ✅ Interests - `/app/date-profile/interests.tsx`
7. ✅ Important Dates - `/app/date-profile/important-dates.tsx`
8. ✅ Notes - `/app/date-profile/notes.tsx`

## Issues to Fix

### 1. Row Level Security (RLS) Policies ⚠️

**Current Status:** Need to verify RLS policies for `date_profiles` table

**Required Policies:**
```sql
-- Users can insert their own date profiles
CREATE POLICY "Users can insert own date profiles" ON date_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own date profiles
CREATE POLICY "Users can view own date profiles" ON date_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own date profiles
CREATE POLICY "Users can update own date profiles" ON date_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own date profiles
CREATE POLICY "Users can delete own date profiles" ON date_profiles
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Related Tables Need Same Policies:**
- `date_profile_photos`
- `date_profile_interests`
- `date_profile_notes`
- `date_profile_dates`
- `date_profile_memories`
- `date_profile_important_dates`

### 2. Missing Fields in Basic Info

**Current:** Only captures first name, last name, age
**Missing Important Fields:**
- ❌ Date of birth (for zodiac sign calculation)
- ❌ Zodiac sign (auto-calculated from DOB)
- ❌ Occupation/Profession
- ❌ Gender
- ❌ Height

### 3. Incomplete Flow

**Current Issues:**
- No data persistence between screens
- No save-as-you-go functionality
- No X close button on screens
- Age is just a number input (should calculate from DOB)

## Proposed Improvements

### A. Separate Age into Own Screen

**New Screen:** `/app/date-profile/date-of-birth.tsx`

**Flow:**
1. Basic Info (First name, Last name only)
2. **NEW:** Date of Birth (with age auto-calculation)
3. Gender
4. Occupation
5. Height
6. Location
7. Photo
8. Relationship Stage
9. How Met
10. Interests
11. Important Dates
12. Notes

### B. Five Additional Important Questions

1. **Date of Birth & Zodiac Sign**
   - Date picker for DOB
   - Auto-calculate age
   - Auto-calculate zodiac sign
   - Display both prominently

2. **Gender**
   - Male, Female, Other, Prefer not to say
   - Helps with gift suggestions and date ideas

3. **Occupation/Career**
   - Text input
   - Important for conversation topics
   - Helps understand their schedule/lifestyle

4. **Height**
   - Feet/inches or cm
   - Personal preference detail
   - Useful for planning activities

5. **Love Language**
   - Words of Affirmation
   - Quality Time
   - Receiving Gifts
   - Acts of Service
   - Physical Touch
   - Helps understand how they express/receive love

### C. Save-As-You-Go Implementation

**Store:** Create `dateProfileCreationStore.ts`

```typescript
interface DateProfileCreationState {
  // Draft data
  draftProfile: Partial<DateProfileData>;
  currentStep: number;
  
  // Actions
  updateDraft: (data: Partial<DateProfileData>) => void;
  saveDraft: () => Promise<void>;
  loadDraft: (userId: string) => Promise<void>;
  clearDraft: () => void;
}
```

**Auto-save:**
- Save to Supabase after each screen
- Store as draft with `status: 'draft'`
- Allow resuming from where they left off

### D. UI Improvements

**Every Screen Needs:**
1. ✅ X close button (top right)
2. ✅ Save & Exit option
3. ✅ Progress indicator
4. ✅ Skip option (for optional fields)
5. ✅ Back button functionality

**Close Button Behavior:**
- Shows confirmation modal
- Options: "Save & Exit" or "Discard Changes"
- Saves current progress if user chooses

## Database Schema Updates Needed

### 1. Add New Fields to `date_profiles` Table

```sql
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS zodiac_sign VARCHAR(20);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS occupation VARCHAR(255);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS height INTEGER; -- in cm
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS love_language VARCHAR(50);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft'; -- draft, active, archived
```

### 2. Update Existing Fields

```sql
-- Make sure these exist
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
```

## Implementation Steps

### Phase 1: Database & Security ✅
1. ✅ Verify `date_profiles` table exists
2. ⏳ Add missing columns
3. ⏳ Create RLS policies for all date profile tables
4. ⏳ Test policies with sample data

### Phase 2: Store & Data Management
1. ⏳ Create `dateProfileCreationStore.ts`
2. ⏳ Implement auto-save functionality
3. ⏳ Add draft loading/resuming
4. ⏳ Update `dateProfileStore.ts` with new fields

### Phase 3: Update Existing Screens
1. ⏳ Add X close button to all screens
2. ⏳ Add save & exit functionality
3. ⏳ Implement data persistence
4. ⏳ Update basic-info.tsx (remove age)

### Phase 4: Create New Screens
1. ⏳ `date-of-birth.tsx` - DOB picker with age/zodiac calculation
2. ⏳ `gender.tsx` - Gender selection
3. ⏳ `occupation.tsx` - Career/job input
4. ⏳ `height.tsx` - Height input (ft/in or cm)
5. ⏳ `love-language.tsx` - Love language selection

### Phase 5: Update Flow & Navigation
1. ⏳ Update step count (8 → 13 steps)
2. ⏳ Reorder screens logically
3. ⏳ Update progress indicators
4. ⏳ Test complete flow end-to-end

### Phase 6: Testing & Polish
1. ⏳ Test RLS policies
2. ⏳ Test save & exit functionality
3. ⏳ Test draft resuming
4. ⏳ Test data persistence
5. ⏳ Test all calculations (age, zodiac)

## New Flow Structure

```
Home → New Date Profile Button
    ↓
Intro Modal (explains what date profiles are)
    ↓
1. Basic Info (First name, Last name)
    ↓
2. Date of Birth (DOB picker → auto age & zodiac)
    ↓
3. Gender (Male/Female/Other)
    ↓
4. Occupation (Text input)
    ↓
5. Height (Feet/inches or cm)
    ↓
6. Location (City, state)
    ↓
7. Photo (Upload or skip)
    ↓
8. Relationship Stage (Talking/Dating/Exclusive/Engaged)
    ↓
9. How Met (Story/description)
    ↓
10. Love Language (5 options)
    ↓
11. Interests (Hobbies, favorites)
    ↓
12. Important Dates (Birthday, anniversary)
    ↓
13. Notes (Quick notes/reminders)
    ↓
Complete! → View Profile
```

## Data Structure

### Complete DateProfileData Interface

```typescript
export interface DateProfileData {
  id: string;
  user_id: string;
  status: 'draft' | 'active' | 'archived';
  
  // Basic Info
  first_name: string;
  last_name?: string;
  date_of_birth?: Date;
  age?: number;
  zodiac_sign?: string;
  gender?: string;
  occupation?: string;
  height?: number; // in cm
  
  // Relationship Info
  relationship_stage: 'talking' | 'dating' | 'exclusive' | 'engaged';
  how_met?: string;
  start_date?: Date;
  love_language?: string;
  
  // Location
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  
  // Media
  photos?: string[];
  primary_photo?: string;
  
  // Related Data (from other tables)
  interests?: InterestData;
  important_dates?: ImportantDate[];
  notes?: QuickNote[];
  dates?: DateRecord[];
  memories?: Memory[];
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}
```

## Success Criteria

✅ Users can create unlimited date profiles (premium limits later)
✅ All data saves automatically as users progress
✅ Users can exit and resume anytime
✅ RLS policies protect user data
✅ Age and zodiac calculated automatically
✅ All 13 screens work smoothly
✅ Data persists correctly to database
✅ Users can view/edit profiles after creation

## Notes

- This is NOT a dating app - it's a dating coach/wingman
- Users create profiles for people THEY are dating
- Helps remember important details
- Useful for people who are dating, engaged, or married
- Multiple audiences: daters, couples, engaged, married
