# Age Calculation Fix

## Problem
The `age` field in the database was showing `0` or empty after users completed onboarding.

## Root Cause
The date of birth screen was only saving the `dateOfBirth` but not calculating and saving the `age` field.

## Solution Applied

### File Modified: `/app/onboarding/dateOfBirth.tsx`

**Added age calculation function:**
```typescript
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
```

**Updated data saving:**
```typescript
getDataToSave: () => ({
  dateOfBirth: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
  age: calculateAge(date),
})
```

## How It Works

### Data Flow:
1. User selects birth date in date picker
2. Age is calculated automatically using `calculateAge()` function
3. Both `dateOfBirth` and `age` are saved to onboarding store
4. Store converts camelCase to snake_case for database:
   - `dateOfBirth` → `date_of_birth`
   - `age` → `age`
5. Data saved to `users` table in Supabase

### Age Calculation Logic:
- Calculates years between birth date and today
- Accounts for whether birthday has occurred this year
- Example: Born Jan 15, 1995, today is Oct 24, 2025
  - Base calculation: 2025 - 1995 = 30
  - Birthday already passed this year (Jan < Oct)
  - Final age: 30 ✅

- Example: Born Dec 25, 1995, today is Oct 24, 2025
  - Base calculation: 2025 - 1995 = 30
  - Birthday hasn't occurred yet (Dec > Oct)
  - Subtract 1: 30 - 1 = 29 ✅

## Verification

### To Test:
1. Create new test account
2. Complete onboarding through date of birth step
3. Check database: Supabase → Table Editor → users
4. Find your user and verify:
   - `date_of_birth` has value (YYYY-MM-DD format)
   - `age` has calculated value (not 0)

### Expected Results:
```
date_of_birth: "1995-01-15"
age: 30
```

## Additional Notes

### Backup Age Calculation
The `onboardingStore` also has age calculation logic as a backup:
- If age isn't provided in the data
- It calculates from `dateOfBirth` before saving to database
- This provides redundancy

### Field Name Consistency
- **In Store (OnboardingData):** Uses camelCase (`dateOfBirth`, `age`)
- **In Database:** Uses snake_case (`date_of_birth`, `age`)
- **Store handles conversion** when saving to database

## Summary
✅ Age now calculated automatically from birth date
✅ Both date_of_birth and age saved to database
✅ Calculation accounts for whether birthday occurred this year
✅ Redundant calculation in store as backup
✅ Ready for testing with new accounts
