# 🔴 CRITICAL: Run Database Migration NOW

## This Must Be Done Before Testing!

The date profile flow will NOT work until you run this migration.

---

## Step-by-Step Instructions

### Option 1: Supabase Dashboard (Easiest)

#### 1. Open the SQL File
- Navigate to: `/Users/blackpanther/Desktop/Rizzers/supabase/migrations/date_profiles_complete_setup.sql`
- Open it in your code editor
- Select ALL content (Cmd+A)
- Copy (Cmd+C)

#### 2. Go to Supabase Dashboard
- Open: https://supabase.com/dashboard
- Select your "Rizzers" project
- Click **"SQL Editor"** in the left sidebar

#### 3. Create New Query
- Click **"New Query"** button (top right)
- Paste the SQL (Cmd+V)
- Click **"Run"** button (bottom right)

#### 4. Wait for Completion
- Should take 5-10 seconds
- You'll see: "Success. No rows returned"
- Check for any error messages

#### 5. Verify Success
Scroll through the results. You should see:
- ✅ "ALTER TABLE" (multiple times)
- ✅ "CREATE INDEX" (multiple times)
- ✅ "CREATE POLICY" (many times)
- ✅ "CREATE FUNCTION"
- ✅ "CREATE TRIGGER"

---

## What This Migration Does

### 1. Adds New Columns (7 total)
- `date_of_birth` - Birthday
- `zodiac_sign` - Auto-calculated
- `gender` - Male/Female/Other
- `occupation` - Career/job
- `height` - Height in cm
- `love_language` - Primary love language
- `status` - draft/active/archived

### 2. Creates RLS Policies (28 policies!)
Protects all 7 date profile tables:
- `date_profiles`
- `date_profile_photos`
- `date_profile_interests`
- `date_profile_notes`
- `date_profile_dates`
- `date_profile_memories`
- `date_profile_important_dates`

Each table gets 4 policies:
- INSERT (users can create)
- SELECT (users can view)
- UPDATE (users can edit)
- DELETE (users can remove)

### 3. Auto-Calculation
- Zodiac sign automatically calculated from DOB
- Database trigger handles this
- No manual work needed!

---

## Verification Steps

### After Running Migration:

#### 1. Check Columns
- Go to **"Table Editor"** → **"date_profiles"**
- Scroll right
- Should see new columns: `date_of_birth`, `zodiac_sign`, `gender`, `occupation`, `height`, `love_language`, `status`

#### 2. Check Policies
- Go to **"Authentication"** → **"Policies"**
- Select **"date_profiles"** table
- Should see 4 policies:
  - Users can insert own date profiles
  - Users can view own date profiles
  - Users can update own date profiles
  - Users can delete own date profiles

#### 3. Check Function
- Go to **"Database"** → **"Functions"**
- Should see: `calculate_zodiac_sign`

#### 4. Check Trigger
- Go to **"Database"** → **"Triggers"**
- On `date_profiles` table
- Should see: `trigger_update_zodiac_sign`

---

## Test the Migration

### Quick Test:

1. Go to **"Table Editor"** → **"date_profiles"**
2. Click **"Insert"** → **"Insert row"**
3. Fill in:
   - `user_id`: Your user ID from auth.users
   - `first_name`: "Test"
   - `date_of_birth`: "1995-03-25"
   - `status`: "draft"
4. Click **"Save"**
5. Check the row - `zodiac_sign` should automatically be **"Aries"**! ✨

---

## Common Issues & Solutions

### ❌ "relation 'date_profiles' does not exist"
**Solution:** The table wasn't created yet. Run the initial schema migration first.

### ❌ "column 'date_of_birth' already exists"
**Solution:** That's OK! The migration uses `IF NOT EXISTS` so it will skip existing columns. Continue.

### ❌ "permission denied"
**Solution:** Make sure you're logged in as the project owner or have admin access.

### ❌ "syntax error near..."
**Solution:** Make sure you copied the ENTIRE SQL file, including all semicolons.

---

## After Migration is Complete

### ✅ You Can Now:
- Create date profiles with all new fields
- Age and zodiac auto-calculate
- Data is secure (RLS policies active)
- Save drafts and resume later
- All 13 steps work correctly

### 🎯 Next Steps:
1. ✅ Migration complete
2. Test creating a date profile
3. Verify data saves correctly
4. Check that drafts load
5. Confirm RLS policies work

---

## Need Help?

If you see errors:
1. Read the error message carefully
2. Check which line failed
3. Try running that section separately
4. Check Supabase logs for details

---

## File Location

**Full Path:**
```
/Users/blackpanther/Desktop/Rizzers/supabase/migrations/date_profiles_complete_setup.sql
```

---

## Ready?

Once you run this migration, the date profile flow will be **fully functional**! 🚀

**Estimated Time:** 5 minutes
**Difficulty:** Easy (just copy & paste)
**Impact:** CRITICAL (nothing works without this)

---

## ✅ Checklist

- [ ] Opened SQL file
- [ ] Copied entire content
- [ ] Opened Supabase Dashboard
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Verified success (no errors)
- [ ] Checked new columns exist
- [ ] Checked policies exist
- [ ] Tested zodiac auto-calculation

---

**Once complete, proceed to testing the date profile flow!**
