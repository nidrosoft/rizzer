# User Data Storage Guide

## Overview
All user onboarding and profile data is stored in the **`users`** table in Supabase. This is your single source of truth for user information.

## Database Location
**Supabase Dashboard** → **Table Editor** → **users** table

## What You See in Supabase Auth vs Users Table

### Supabase Auth (What you showed in screenshot):
- **UID**: User's authentication ID
- **Display name**: Empty (not used)
- **Phone**: User's phone number
- **Email**: Empty (phone auth only)

### Users Table (Where ALL data is stored):
This is where you'll find everything! Here's what's stored:

## Complete User Data Schema

### Basic Information
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | User's unique ID (matches auth UID) | `e33b4977-9cd6-4e91-8b55-b2c6b5896d7` |
| `phone` | string | Phone number | `+19197770989` |
| `name` | string | Full name from onboarding | `John Doe` |
| `email` | string | Email (optional) | `john@example.com` |
| `created_at` | timestamp | Account creation date | `2025-10-24 19:00:51` |
| `updated_at` | timestamp | Last profile update | `2025-10-24 19:15:32` |

### Personal Details
| Field | Type | Description |
|-------|------|-------------|
| `date_of_birth` | string | Birth date | 
| `age` | number | Calculated age |
| `gender` | string | Gender identity |
| `height` | number | Height in inches |
| `ethnicity` | string | Ethnicity |
| `religion` | string | Religious preference |
| `zodiac_sign` | string | Zodiac sign |
| `bio` | string | User bio/description |
| `occupation` | string | Job/profession |

### Location Data
| Field | Type | Description |
|-------|------|-------------|
| `location` | JSON | Full location object |

**Location JSON structure:**
```json
{
  "city": "La Mesa",
  "state": "CA",
  "zipCode": "91942",
  "latitude": 32.7678,
  "longitude": -117.0231
}
```

### Photos & Media
| Field | Type | Description |
|-------|------|-------------|
| `photos` | JSON Array | All user photos |
| `avatar_url` | string | Primary profile photo URL |

**Photos JSON structure:**
```json
[
  "https://your-supabase-url/storage/v1/object/public/photos/user-id/photo1.jpg",
  "https://your-supabase-url/storage/v1/object/public/photos/user-id/photo2.jpg"
]
```

### Preferences & Goals
| Field | Type | Description |
|-------|------|-------------|
| `primary_goal` | string | Main app goal |
| `looking_for` | string | What they're seeking |
| `relationship_type` | string | Relationship preference |
| `drinking` | string | Drinking habits |
| `interests` | string[] | Array of interests |

**Interests array example:**
```json
["Travel", "Fitness", "Cooking", "Music"]
```

### Onboarding Progress
| Field | Type | Description |
|-------|------|-------------|
| `onboarding_completed` | boolean | Finished onboarding? |
| `onboarding_step` | number | Current step (1-16) |

### Premium & Admin
| Field | Type | Description |
|-------|------|-------------|
| `is_premium` | boolean | Premium subscriber? |
| `premium_expires_at` | timestamp | Premium expiration |
| `is_admin` | boolean | Admin privileges? |
| `is_banned` | boolean | Account banned? |
| `ban_reason` | string | Ban reason if applicable |
| `flagged_count` | number | Times flagged |
| `last_active_at` | timestamp | Last activity |

## How to View Your Data in Supabase

### Step 1: Go to Table Editor
1. Open Supabase Dashboard
2. Click **"Table Editor"** in left sidebar
3. Select **"users"** table

### Step 2: View User Data
You'll see all columns with data for each user. Look for:
- The phone number you signed up with
- The name you entered during onboarding
- All other fields populated during signup

### Step 3: View Photos
Photos are stored in **Supabase Storage**:
1. Click **"Storage"** in left sidebar
2. Open **"photos"** bucket
3. Navigate to user's folder (by user ID)
4. See all uploaded photos

## Why You Only See UID in Auth

The Supabase **Authentication** section only shows:
- Authentication credentials (phone, email)
- User ID (UID)
- Provider info

It does **NOT** show profile data. That's all in the **users** table!

## Data Flow During Onboarding

```
User Signs Up
    ↓
Auth Account Created (UID generated)
    ↓
Users Table Row Created (with UID as id)
    ↓
Step 1: Name → users.name
    ↓
Step 2: Date of Birth → users.date_of_birth, users.age
    ↓
Step 3: Gender → users.gender
    ↓
Step 4: Location → users.location (JSON)
    ↓
Step 5: Height → users.height
    ↓
... (continues for all steps)
    ↓
Step 8: Photos → Supabase Storage + users.photos (URLs)
    ↓
... (more steps)
    ↓
Step 16: Complete → users.onboarding_completed = true
```

## How Data is Saved

### During Onboarding
File: `/hooks/useOnboardingStep.ts`

```typescript
const saveProgress = async () => {
  const { error } = await supabase
    .from('users')
    .update({
      ...dataToSave,
      onboarding_step: stepNumber,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
};
```

### Photo Upload
File: `/lib/storage.ts`

```typescript
export async function uploadPhoto(uri: string, userId: string) {
  // 1. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(filePath, file);
  
  // 2. Get public URL
  const publicUrl = supabase.storage
    .from('photos')
    .getPublicUrl(filePath).data.publicUrl;
  
  // 3. Save URL to users.photos array
  return publicUrl;
}
```

## Verifying Data is Saved

### Check in Supabase:
1. **Table Editor** → **users** → Find your user by phone
2. Scroll right to see all columns
3. Verify each field has data

### Check in App:
1. Add console.log in `/store/authStore.ts`:
```typescript
console.log('User data:', user);
```
2. Check browser/app console
3. See all user fields

## Common Issues

### "I don't see my data!"
**Solution:** You're looking at Auth instead of users table
- Go to **Table Editor** → **users**
- NOT Authentication → Users

### "Photos not showing"
**Solution:** Check two places:
1. **Storage** → **photos** bucket → user's folder
2. **Table Editor** → **users** → `photos` column (should have URLs)

### "Name is empty"
**Solution:** Check `users.name` column
- If empty, onboarding didn't save
- Check console for errors during signup

## Dynamic Greeting Implementation ✅

### Feature: Time-Based Greeting with Emojis

**File:** `/components/home/HomeHeader.tsx`

**Implementation:**
```typescript
const { greeting, emoji } = useMemo(() => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good Morning', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good Afternoon', emoji: '🌤️' };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good Evening', emoji: '🌆' };
  } else {
    return { greeting: 'Good Night', emoji: '🌙' };
  }
}, []);
```

**Time Ranges:**
- **5am - 12pm**: "Good Morning ☀️"
- **12pm - 5pm**: "Good Afternoon 🌤️"
- **5pm - 9pm**: "Good Evening 🌆"
- **9pm - 5am**: "Good Night 🌙"

**Display:**
```
☀️ Good Morning
John Doe
```

## Profile Photo Display ✅

### Feature: Show User's Uploaded Photo

**Implementation:**
```typescript
const profilePhoto = useMemo(() => {
  // Priority 1: First photo from photos array
  if (user?.photos && Array.isArray(user.photos) && user.photos.length > 0) {
    return user.photos[0];
  }
  // Priority 2: Avatar URL
  if (user?.avatar_url) {
    return user.avatar_url;
  }
  // Fallback: Default avatar
  return 'https://i.pravatar.cc/150?img=12';
}, [user?.photos, user?.avatar_url]);
```

**Photo Priority:**
1. First photo from `users.photos` array
2. `users.avatar_url` if set
3. Default placeholder if none

## Summary

✅ **All data IS being saved** - just look in the right place!
✅ **Location:** Supabase → Table Editor → users table
✅ **Photos:** Supabase → Storage → photos bucket
✅ **Dynamic greeting:** Implemented with time-based emojis
✅ **Profile photo:** Now shows user's uploaded photo

The Supabase Auth section is ONLY for authentication. All profile data is in the **users** table!
