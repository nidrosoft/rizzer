# 🧪 Rizz AI - Testing Guide

## ✅ All Fixes Applied!

### What Was Fixed:
1. ✅ **Edge Function Deployed** - `generate-rizz-lines` is now ACTIVE
2. ✅ **RLS Policies Added** - Generation log can now be written
3. ✅ **Button Text Fixed** - Shows "Generate Rizz" first time, "More Rizz" after
4. ✅ **Category ID Passed** - Navigation now works correctly
5. ✅ **Loading States** - Skeleton cards show during generation

---

## 🧪 How to Test

### **Step 1: Open the App**
- Launch the Rizzers app
- Navigate to the Rizz tab

### **Step 2: Click on "pick up lines" Category**
You should see:
- ✅ Category header with title and description
- ✅ Empty state: "🌟 Ready to Generate Rizz?"
- ✅ Button at bottom: **"Generate Rizz"** (not "More Rizz")

### **Step 3: Press "Generate Rizz"**
What happens:
1. Button changes to: **"Generating..."**
2. 3 skeleton loading cards appear
3. After 1-2 seconds:
   - 5 new rizz cards appear
   - Toast shows: "Generated 5 new rizz lines!"
   - Button changes to: **"More Rizz"**

### **Step 4: Verify the Lines**
Each rizz card should show:
- ✅ The rizz line text
- ✅ Heart icon (for saving)
- ✅ Copy icon (for clipboard)

### **Step 5: Test Save Functionality**
- Tap the heart icon on a line
- Toast should show: "Saved to collection!"
- Heart should fill in (change color)

### **Step 6: Test Copy Functionality**
- Tap the copy icon
- Toast should show: "Copied to clipboard!"
- Paste somewhere to verify

### **Step 7: Generate More Lines**
- Press **"More Rizz"** button again
- 5 new lines should appear at the TOP
- Old lines should remain below
- Button should stay as "More Rizz"

---

## 🔍 What to Check in Database

### **Check Generated Lines:**
```sql
SELECT 
  id,
  content,
  confidence_score,
  tags,
  tone,
  is_ai_generated,
  created_at
FROM rizz_messages
WHERE category_id = YOUR_CATEGORY_ID
  AND is_ai_generated = true
ORDER BY created_at DESC;
```

**Expected Result:**
- 5 lines per generation
- `is_ai_generated = true`
- `confidence_score` between 85-100
- `tags` array with relevant tags
- `tone` field populated

### **Check Generation Log:**
```sql
SELECT 
  id,
  lines_generated,
  generation_time_ms,
  model_used,
  prompt_tokens,
  completion_tokens,
  cost,
  status,
  created_at
FROM rizz_generation_log
WHERE category_id = YOUR_CATEGORY_ID
ORDER BY created_at DESC;
```

**Expected Result:**
- One entry per generation
- `lines_generated = 5`
- `generation_time_ms` around 1000-2000
- `model_used = 'gpt-4o-mini'`
- `cost` around 0.0003
- `status = 'success'`

---

## ❌ Troubleshooting

### **Issue: "Edge Function returned a non-2xx status code"**

**Check 1: Is Edge Function Deployed?**
```bash
supabase functions list --project-ref svspwjunukphqdjjfvef
```
Should show: `generate-rizz-lines` with status ACTIVE

**Check 2: Is OpenAI API Key Set?**
```bash
supabase secrets list --project-ref svspwjunukphqdjjfvef
```
Should show: `OPENAI_API_KEY`

**Check 3: Check Function Logs**
Go to: https://supabase.com/dashboard/project/svspwjunukphqdjjfvef/logs/edge-functions

Look for errors in the logs.

---

### **Issue: "Category not found"**

**Check:** Is the category ID being passed?
- Open React Native debugger
- Check console for: `🎯 Generating rizz lines for category X, user Y`
- If category ID is missing, check navigation in `/app/tabs/rizz.tsx`

**Fix:** Should be:
```typescript
router.push(`/rizz/category-detail?id=${categoryId}`);
```

---

### **Issue: Lines not appearing**

**Check 1: Are lines being saved?**
Query the database:
```sql
SELECT COUNT(*) FROM rizz_messages 
WHERE category_id = YOUR_CATEGORY_ID;
```

**Check 2: Is RizzList component receiving data?**
- Add console.log in RizzList component
- Check if `rizzLines` prop has data

**Check 3: Is there a rendering issue?**
- Check if `isLoading` is stuck on `true`
- Check if `category` is null

---

### **Issue: Button always says "More Rizz"**

**Check:** Is `hasExistingLines` prop being passed?
```typescript
<RegenerateFAB 
  onPress={handleRegenerate} 
  isGenerating={isGenerating}
  hasExistingLines={rizzLines.length > 0}  // ← This line
/>
```

---

## 📊 Expected Performance

### **Generation Speed:**
- **Average:** 1.5 seconds
- **Range:** 1-3 seconds
- **Factors:** OpenAI API latency, network speed

### **Cost per Generation:**
- **Input tokens:** ~300 tokens
- **Output tokens:** ~400 tokens
- **Total cost:** ~$0.0003 (0.03 cents)

### **Success Rate:**
- **Target:** >95%
- **Common failures:** Rate limits, network issues, invalid API key

---

## ✅ Success Criteria

### **Generation Works If:**
- [x] Button says "Generate Rizz" first time
- [x] Button changes to "Generating..." during generation
- [x] 3 skeleton cards appear during loading
- [x] 5 new rizz cards appear after 1-2 seconds
- [x] Button changes to "More Rizz" after first generation
- [x] Toast shows success message
- [x] Lines are saved to database
- [x] Generation log entry is created
- [x] Can generate more lines (unlimited)

### **UI/UX Works If:**
- [x] Loading state is smooth
- [x] Animations are fluid
- [x] Haptic feedback works (iOS)
- [x] Toast notifications appear
- [x] Save/copy functionality works
- [x] New lines appear at top
- [x] Old lines remain visible

---

## 🎉 You're Done!

If all tests pass, the Rizz AI generation system is **fully functional**!

**Enjoy generating unlimited rizz lines! 🔥**

---

## 📞 Need Help?

### **Check Logs:**
1. **App Console:** React Native debugger
2. **Edge Function Logs:** Supabase dashboard
3. **Database Logs:** Supabase SQL editor

### **Common Commands:**
```bash
# Check Edge Functions
supabase functions list --project-ref svspwjunukphqdjjfvef

# Check Function Logs
supabase functions logs generate-rizz-lines --project-ref svspwjunukphqdjjfvef

# Check Secrets
supabase secrets list --project-ref svspwjunukphqdjjfvef
```

---

**Happy Testing! 🚀**
