# Remaining Screens to Update

## Status

✅ **Completed:**
1. basic-info.tsx - Step 1 of 13
2. date-of-birth.tsx - Step 2 of 13 (NEW)
3. gender.tsx - Step 3 of 13 (NEW)
4. occupation.tsx - Step 4 of 13 (NEW)
5. height.tsx - Step 5 of 13 (NEW)
6. location.tsx - Step 6 of 13 ✅
7. photo.tsx - Step 7 of 13 ✅

## ⏳ Still Need Updates:

8. **relationship-stage.tsx** - Update to Step 8 of 13
9. **how-met.tsx** - Update to Step 9 of 13
10. **love-language.tsx** - Step 10 of 13 (NEW - Already done)
11. **interests.tsx** - Update to Step 11 of 13
12. **important-dates.tsx** - Update to Step 12 of 13
13. **notes.tsx** - Update to Step 13 of 13 + Add completeDraft()

## Quick Updates Needed

For each screen (8, 9, 11, 12, 13):
1. Import `useDateProfileCreationStore`
2. Connect to store
3. Update step numbers
4. Add `handleCancel` and `handleSaveAsDraft`
5. Update navigation to next screen
6. Call `saveDraft()` before navigating

## Navigation Flow

```
1. basic-info → date-of-birth ✅
2. date-of-birth → gender ✅
3. gender → occupation ✅
4. occupation → height ✅
5. height → location ✅
6. location → photo ✅
7. photo → relationship-stage (NEXT)
8. relationship-stage → how-met
9. how-met → love-language ✅
10. love-language → interests ✅
11. interests → important-dates
12. important-dates → notes
13. notes → Complete! (call completeDraft)
```

## Special Note for notes.tsx (Last Screen)

This is the final screen, so it needs special handling:

```typescript
const handleContinue = async () => {
  // Save notes
  updateDraft({ initial_notes: notes.trim() });
  await saveDraft();
  
  // Complete the profile (changes status to 'active')
  const result = await completeDraft();
  
  if (result.success) {
    // Show success and navigate to profile view
    router.push(`/date-profile/${result.profileId}`);
  }
};
```

## Implementation Progress

- **7 of 13 screens complete** (54%)
- **6 screens remaining** (46%)
- **Estimated time:** 20 minutes
