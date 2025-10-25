# How to Run the Database Migration

## 🔴 CRITICAL: This Must Be Done First!

The date profile flow will NOT work until you run this migration. It adds required columns and security policies.

## Option 1: Supabase Dashboard (Recommended)

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your "Rizzers" project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query" button (top right)

3. **Copy the Migration**
   - Open file: `supabase/migrations/date_profiles_complete_setup.sql`
   - Select ALL content (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)

4. **Paste and Run**
   - Paste into the SQL Editor (Cmd+V / Ctrl+V)
   - Click "Run" button (bottom right)
   - Wait for completion (should take 5-10 seconds)

5. **Verify Success**
   - You should see "Success. No rows returned"
   - Check the results at the bottom
   - Should show tables and policies created

### What to Look For:

**Success Messages:**
```
ALTER TABLE
CREATE INDEX
ALTER TABLE (multiple times)
CREATE POLICY (many times)
CREATE FUNCTION
CREATE TRIGGER
```

**If You See Errors:**
- "column already exists" → OK, skip that column
- "policy already exists" → OK, skip that policy
- "relation does not exist" → PROBLEM, table missing
- "permission denied" → PROBLEM, check your role

## Option 2: Supabase CLI

### If You Have Supabase CLI Installed:

```bash
cd /Users/blackpanther/Desktop/Rizzers
supabase db push
```

This will automatically run all migrations in the `supabase/migrations/` folder.

## What This Migration Does

### 1. Adds New Columns
- `date_of_birth` - For birthday
- `zodiac_sign` - Auto-calculated from DOB
- `gender` - Male/Female/Other
- `occupation` - Career/job
- `height` - Height in cm
- `love_language` - Primary love language
- `status` - draft/active/archived

### 2. Creates RLS Policies
- Users can only see/edit their own profiles
- Applies to all 7 date profile tables
- Prevents unauthorized access

### 3. Auto-Calculation
- Zodiac sign automatically calculated from DOB
- Database trigger handles this
- No manual calculation needed

### 4. Performance
- Adds indexes for faster queries
- Optimizes common lookups

## Verification Steps

### After Running Migration:

1. **Check Columns Exist**
   - Go to "Table Editor" → "date_profiles"
   - Scroll right to see new columns
   - Should see: date_of_birth, zodiac_sign, gender, occupation, height, love_language, status

2. **Check RLS Policies**
   - Go to "Authentication" → "Policies"
   - Select "date_profiles" table
   - Should see 4 policies:
     - Users can insert own date profiles
     - Users can view own date profiles
     - Users can update own date profiles
     - Users can delete own date profiles

3. **Check Function Exists**
   - Go to "Database" → "Functions"
   - Should see: `calculate_zodiac_sign`
   - Should see: `update_zodiac_sign`

4. **Check Trigger Exists**
   - Go to "Database" → "Triggers"
   - On "date_profiles" table
   - Should see: `trigger_update_zodiac_sign`

## Test the Migration

### Create a Test Profile:

1. Go to "Table Editor" → "date_profiles"
2. Click "Insert" → "Insert row"
3. Fill in:
   - `user_id`: Your user ID from auth.users
   - `first_name`: "Test"
   - `date_of_birth`: "1995-03-25"
   - `status`: "draft"
4. Click "Save"
5. Check the row - `zodiac_sign` should automatically be "Aries"!

### Test RLS Policies:

1. Try to view the profile from the app
2. Should only see your own profiles
3. Should NOT see other users' profiles

## Common Issues

### Issue: "relation 'date_profiles' does not exist"
**Solution:** The table wasn't created yet. You need to run the initial schema migration first.

### Issue: "column 'date_of_birth' already exists"
**Solution:** That's OK! The migration uses `IF NOT EXISTS` so it will skip existing columns.

### Issue: "permission denied"
**Solution:** Make sure you're logged in as the project owner or have admin access.

### Issue: "syntax error near..."
**Solution:** Make sure you copied the ENTIRE SQL file, including all semicolons.

## After Migration is Complete

### You Can Now:
✅ Create date profiles with all new fields
✅ Age and zodiac auto-calculate
✅ Data is secure (RLS policies active)
✅ Save drafts and resume later
✅ All 13 steps work correctly

### Next Steps:
1. Test creating a date profile
2. Verify data saves correctly
3. Check that drafts load
4. Confirm RLS policies work

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Look for the specific line that failed
3. Try running that section separately
4. Check Supabase logs for details

## Migration File Location

**Full Path:**
```
/Users/blackpanther/Desktop/Rizzers/supabase/migrations/date_profiles_complete_setup.sql
```

## Ready?

Once you run this migration, the date profile flow will be fully functional! 🚀

**Estimated Time:** 5 minutes
**Difficulty:** Easy (just copy & paste)
**Impact:** CRITICAL (nothing works without this)
