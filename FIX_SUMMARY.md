# Fix Summary

## Root Cause Analysis

The "No user ID found" error occurs because:
1. User profile creation in database wasn't properly error-handled
2. Auth store wasn't fully updated before navigation to onboarding
3. Timing issue between OTP verification and user state availability

## Fixes Applied

1. **User Profile Creation** (`store/authStore.ts`)
   - Added proper error handling for database insert
   - Added logging to track user creation process
   - Added validation to ensure profile is created before proceeding
   - Throws clear error if insert fails

2. **Navigation Timing** (`app/phone-otp.tsx`)
   - Increased delay from 500ms to 1000ms after login
   - Added user validation before navigation
   - Added logging to track auth flow
   - Throws error if user not found after login

3. **Database Types** (`types/database.types.ts`)
   - Completed Insert and Update type definitions
   - All fields now properly typed

4. **Last Name Field** (`app/onboarding/name.tsx`)
   - Placeholder: "Last name (optional)"
   - Helper text: "Your first name is all we need to get started"

## Testing Instructions

1. Delete user from Supabase dashboard
2. Sign up with phone number
3. Verify OTP code
4. Check console logs for:
   - "📝 Creating new user profile for: [user-id]"
   - "✅ User profile created successfully: [user-id]"
   - "👤 User after login: [user object]"
5. Should navigate to onboarding without error

## Sign-Up/Sign-In Flow Updates

### 1. **New Sign-In Screen** (`app/phone-signin.tsx`)
   - Created dedicated sign-in screen with "Let's get you back in..." heading
   - Same phone input functionality as sign-up
   - Uses same OTP verification flow
   - Connects to database to verify existing users

### 2. **Sign-Up Disclosure Text** (`app/phone-entry.tsx`)
   - Added SMS disclosure text:
     - "By entering your number, you agree to get texts about your account..."
     - "Message frequency varies and data rates may apply. Reply STOP to cancel."
   - Styled with smaller font (12px) and lighter color
   - Positioned between info text and continue button

### 3. **Landing Page Update** (`app/landing.tsx`)
   - Connected "Sign In" button to new `/phone-signin` route
   - Added haptic feedback on tap
   - Maintains existing sign-up flow

## Database Connection

Both sign-up and sign-in flows use the same authentication system:
- `sendOTP()` - Sends verification code via Twilio
- `verifyOTP()` - Verifies code and creates/retrieves user session
- User profile created in database on first sign-up
- Existing users retrieved from database on sign-in
- All data properly saved to Supabase `users` table

## UI/UX Improvements

### 1. **Keyboard Handling** (`phone-entry.tsx`, `phone-signin.tsx`)
   - Wrapped screens in `TouchableWithoutFeedback` to dismiss keyboard on tap
   - Users can now tap anywhere to hide keyboard and see continue button
   - Fixes frustration of keyboard blocking the button

### 2. **Sign-In Close Button Position** (`phone-signin.tsx`)
   - Moved close button from left to right side
   - Changed style from `backButton` to `closeButton`
   - Now matches sign-up screen layout

### 3. **Error Handling for Sign-In**
   - Sign-in uses same error modals as sign-up
   - Funny error messages for:
     - Invalid phone number format
     - Too many/too few digits
     - Network errors
     - Rate limiting
     - Non-existent user (Twilio error)
   - Consistent UX across both flows

## Critical Bug Fix - OTP Verification

### **Issue:**
- OTP was being verified successfully
- User was created in Supabase database
- But app showed "code couldn't be verified" error
- User couldn't proceed to onboarding

### **Root Cause:**
In `authStore.ts`, the login function had incomplete error handling:
- When profile fetch returned an error OTHER than "user doesn't exist" (PGRST116)
- The code didn't handle it and skipped setting user state
- This caused the login to fail even though authentication succeeded
- User was created but app state wasn't updated

### **Fix:**
Added comprehensive fallback handling:
1. If profile fetch fails with PGRST116 → Create new user (existing logic)
2. **NEW:** If profile fetch fails with OTHER error → Use auth data as fallback
3. If profile exists → Load full profile (existing logic)
4. **NEW:** If no profile and no error → Use auth data as fallback

Now the app will ALWAYS set user state after successful OTP verification, even if there are temporary database issues.

## Database Policy Fix - Infinite Recursion (CRITICAL)

### **Issue:**
- After successful signup, entering name caused "infinite recursion detected in policy for relation users"
- User couldn't proceed with onboarding
- Error code: 42P17

### **Root Causes (Triple-Checked via MCP):**

1. **Infinite Recursion in Admin Policy**
   - Policy checked `users` table to verify if user is admin
   - This triggered SELECT policies, which checked `users` table again
   - Created infinite loop: SELECT → check admin → SELECT → check admin...

2. **Missing INSERT Policy**
   - No policy allowed INSERT operations
   - User creation during signup was blocked by RLS

3. **Incomplete Policy Coverage**
   - RLS enabled but policies didn't cover all operations

### **Solution (Applied via Migration):**

**1. Fixed Admin Policy**
```sql
-- Old (caused recursion):
EXISTS (SELECT FROM users WHERE id = auth.uid() AND is_admin = true)

-- New (no recursion):
(auth.jwt()->>'is_admin')::boolean = true
```
Uses JWT claims instead of querying database

**2. Added INSERT Policy**
```sql
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

**3. Final Policies:**
- INSERT: Users can create own record
- SELECT: Users see own data, admins see all (via JWT)
- UPDATE: Users update own data
- All policies use `auth.uid()` or `auth.jwt()` (no table queries)

### **Verification:**
✅ No policies query `users` table (recursion impossible)
✅ All CRUD operations covered
✅ Onboarding flow now works end-to-end

See `DATABASE_POLICY_FIX.md` for detailed analysis.

## Changes Not Committed Yet
