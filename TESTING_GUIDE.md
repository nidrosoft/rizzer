# Date Profile Testing Guide

## Prerequisites

✅ Database migration has been run successfully
✅ App is running (`npm start`)
✅ You're logged in to the app

---

## Test 1: Create Complete Date Profile

### Steps:

1. **Start Profile Creation**
   - Go to Home screen
   - Click "New Date Profile" button
   - Should see intro modal (if exists)

2. **Step 1: Basic Info**
   - Enter first name: "Sarah"
   - Enter last name: "Johnson" (optional)
   - Click continue
   - ✅ Should save and navigate to date-of-birth

3. **Step 2: Date of Birth**
   - Select date: March 25, 1995
   - ✅ Should show: "30 years old"
   - ✅ Should show: "Aries"
   - Click continue
   - ✅ Should save and navigate to gender

4. **Step 3: Gender**
   - Select "Female"
   - Click continue
   - ✅ Should save and navigate to occupation

5. **Step 4: Occupation**
   - Enter: "Software Engineer"
   - Click continue
   - ✅ Should save and navigate to height

6. **Step 5: Height**
   - Toggle to "Feet/Inches"
   - Select: 5' 6"
   - ✅ Should show: "168 cm"
   - Click continue
   - ✅ Should save and navigate to location

7. **Step 6: Location**
   - Enter: "San Francisco, CA"
   - Click continue
   - ✅ Should save and navigate to photo

8. **Step 7: Photo**
   - Click "Choose from Gallery" or "Take a Photo"
   - Select/take a photo
   - ✅ Should show preview
   - Click continue
   - ✅ Should save and navigate to relationship-stage

9. **Step 8: Relationship Stage**
   - Select "Dating"
   - Click continue
   - ✅ Should save and navigate to how-met

10. **Step 9: How Met**
    - Select "Dating App"
    - Click continue
    - ✅ Should save and navigate to love-language

11. **Step 10: Love Language**
    - Select "Quality Time"
    - Click continue
    - ✅ Should save and navigate to interests

12. **Step 11: Interests**
    - Select: Travel, Music, Fitness, Cooking
    - ✅ Should show: "4/10"
    - Click continue
    - ✅ Should save and navigate to important-dates

13. **Step 12: Important Dates**
    - Add first date: January 15, 2024
    - Click continue
    - ✅ Should save and navigate to notes

14. **Step 13: Notes**
    - Enter: "Loves Italian food, allergic to cats, enjoys hiking"
    - Click continue
    - ✅ Should show success alert
    - ✅ Should offer "View Profile" or "Go to Home"

### Expected Results:
- ✅ All data saved to database
- ✅ Profile status = 'active'
- ✅ Can view profile
- ✅ All fields populated correctly

---

## Test 2: Save & Exit (Draft System)

### Steps:

1. **Start New Profile**
   - Click "New Date Profile"
   - Enter name: "John"

2. **Exit Early**
   - Click X button (top right)
   - ✅ Should show confirmation
   - Click "Save & Exit"
   - ✅ Should return to home

3. **Resume Draft**
   - Click "New Date Profile" again
   - ✅ Should load draft with "John"
   - ✅ Should be on step 1

4. **Continue from Draft**
   - Add last name: "Smith"
   - Continue through a few more steps
   - Exit again with "Save & Exit"

5. **Resume Again**
   - Click "New Date Profile"
   - ✅ Should load all previous data
   - ✅ Should be on the step you left off

### Expected Results:
- ✅ Draft saves automatically
- ✅ Can resume from any step
- ✅ All data preserved
- ✅ No data loss

---

## Test 3: Verify Database

### Check in Supabase:

1. **Open Supabase Dashboard**
   - Go to Table Editor → date_profiles

2. **Find Your Profile**
   - Look for "Sarah Johnson"
   - Status should be 'active'

3. **Verify All Fields**
   - ✅ `first_name`: "Sarah"
   - ✅ `last_name`: "Johnson"
   - ✅ `date_of_birth`: "1995-03-25"
   - ✅ `age`: 30
   - ✅ `zodiac_sign`: "Aries"
   - ✅ `gender`: "Female"
   - ✅ `occupation`: "Software Engineer"
   - ✅ `height`: 168
   - ✅ `location`: {"city": "San Francisco, CA"}
   - ✅ `relationship_stage`: "Dating"
   - ✅ `how_met`: "Dating App"
   - ✅ `love_language`: "quality_time"
   - ✅ `status`: "active"

4. **Check Draft Profile**
   - Look for "John Smith"
   - Status should be 'draft'
   - Should have partial data

---

## Test 4: RLS Security

### Test User Isolation:

1. **Create Profile with User 1**
   - Log in as first user
   - Create a profile

2. **Switch to User 2**
   - Log out
   - Log in as different user
   - Try to view profiles

3. **Verify Isolation**
   - ✅ User 2 should NOT see User 1's profiles
   - ✅ User 2 can only see their own profiles
   - ✅ RLS policies working correctly

---

## Test 5: Calculations

### Test Auto-Calculations:

1. **Age Calculation**
   - Create profile with DOB: "2000-01-01"
   - ✅ Should show age: 25 (or current age)
   - ✅ Age updates based on current date

2. **Zodiac Calculation**
   - Test different dates:
     - March 25 → Aries ✅
     - July 15 → Cancer ✅
     - December 25 → Capricorn ✅
   - ✅ All zodiac signs calculate correctly

3. **Height Conversion**
   - Enter 5'6" in feet/inches
   - ✅ Should show 168 cm
   - Toggle to cm
   - ✅ Should show 168 cm
   - Change to 170 cm
   - Toggle back to ft/in
   - ✅ Should show 5'7"

---

## Test 6: Edge Cases

### Test Error Handling:

1. **Empty Required Fields**
   - Try to continue without first name
   - ✅ Continue button should be disabled

2. **Network Error**
   - Turn off internet
   - Try to save
   - ✅ Should show error message
   - Turn on internet
   - Try again
   - ✅ Should save successfully

3. **Very Long Text**
   - Enter 500 characters in notes
   - ✅ Should accept (max 500)
   - Try to enter 501 characters
   - ✅ Should limit to 500

4. **Special Characters**
   - Enter name with special chars: "O'Brien"
   - ✅ Should save correctly
   - Enter occupation: "Designer & Developer"
   - ✅ Should save correctly

---

## Test 7: Navigation

### Test Flow Navigation:

1. **Forward Navigation**
   - Go through all 13 steps in order
   - ✅ Each step navigates to next correctly

2. **Back Navigation**
   - Click back button on any step
   - ✅ Should go to previous step
   - ✅ Data should be preserved

3. **Skip Optional Fields**
   - Skip photo (optional)
   - ✅ Should allow skip
   - ✅ Should navigate to next step

---

## Test 8: Photo Upload

### Test Photo Functionality:

1. **Choose from Gallery**
   - Click "Choose from Gallery"
   - ✅ Should request permission (first time)
   - Select a photo
   - ✅ Should show preview
   - ✅ Should save photo URL

2. **Take Photo**
   - Click "Take a Photo"
   - ✅ Should request camera permission
   - Take a photo
   - ✅ Should show preview
   - ✅ Should save photo URL

3. **Change Photo**
   - Upload one photo
   - Upload different photo
   - ✅ Should replace previous photo

---

## Test 9: Multiple Profiles

### Test Multiple Profile Creation:

1. **Create First Profile**
   - Complete all steps
   - ✅ Profile 1 created

2. **Create Second Profile**
   - Click "New Date Profile" again
   - ✅ Should start fresh (not load previous draft)
   - Complete all steps
   - ✅ Profile 2 created

3. **Verify Both Exist**
   - Check home screen
   - ✅ Should show both profiles
   - Check database
   - ✅ Both profiles in date_profiles table

---

## Test 10: Complete Profile View

### After Completion:

1. **View Profile**
   - After completing profile
   - Click "View Profile"
   - ✅ Should navigate to profile detail page
   - ✅ Should show all entered data

2. **Edit Profile**
   - From profile detail
   - Click edit
   - ✅ Should allow editing
   - ✅ Changes should save

---

## Success Criteria

### All Tests Should Pass:

- ✅ Can create complete profile (13 steps)
- ✅ Draft system works (save & resume)
- ✅ All data saves to database correctly
- ✅ RLS policies protect user data
- ✅ Age and zodiac calculate automatically
- ✅ Height conversion works
- ✅ Photo upload works
- ✅ Navigation flows correctly
- ✅ Can create multiple profiles
- ✅ Can view and edit profiles

---

## Reporting Issues

### If You Find Bugs:

1. **Note the Step**
   - Which screen/step?
   - What were you doing?

2. **Check Console**
   - Open browser console
   - Look for error messages
   - Copy error text

3. **Check Database**
   - Did data save?
   - What's in the table?

4. **Check Supabase Logs**
   - Go to Supabase Dashboard
   - Check logs for errors

---

## Performance Checklist

### App Should Be:

- ✅ Fast (< 1 second per screen)
- ✅ Smooth (no lag or stuttering)
- ✅ Responsive (buttons work immediately)
- ✅ Stable (no crashes)

---

## Ready to Test!

Start with **Test 1** (Create Complete Date Profile) and work through each test systematically.

**Good luck!** 🚀
