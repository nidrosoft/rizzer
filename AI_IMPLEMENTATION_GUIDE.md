# 🚀 AI Gift Generation - Implementation Guide

## ✅ **What's Been Created**

### **1. Database Migration** ✅
**File:** `/supabase/migrations/20240125_ai_gift_generation_system.sql`

**What it does:**
- Creates `ai_gift_generation_schedule` table (tracks generation schedule per profile)
- Enhances `ai_gift_generation_log` table (adds more tracking fields)
- Creates helper functions:
  - `get_profiles_needing_generation()` - Returns profiles that need generation
  - `update_generation_schedule()` - Updates schedule after generation
  - `initialize_gift_generation_schedule()` - Auto-creates schedule for new profiles
- Creates analytics views for monitoring
- Backfills existing profiles with schedules

**Run this migration:**
```bash
# In Supabase Dashboard > SQL Editor, paste and run the migration
# Or use Supabase CLI:
supabase db push
```

---

### **2. Data Gathering Functions** ✅
**File:** `/lib/aiGiftDataGathering.ts`

**What it does:**
- `gatherProfileDataForAI()` - Collects all profile data from 8 tables
- `calculateDataQualityScore()` - Scores data quality (0-100%)
- `hasMinimumDataForGeneration()` - Checks if profile has enough data

**Gathers:**
- Profile basics (name, age, favorites)
- Interests (all categories)
- Conversations (last 20)
- Memories (last 10)
- Notes (last 10)
- Dates (last 10)
- Gift history (all)
- Gift ideas (all active)

---

### **3. Prompt Builder** ✅
**File:** `/lib/aiGiftPrompts.ts`

**What it does:**
- `SYSTEM_PROMPT` - Master AI instructions
- `buildUserPrompt()` - Converts profile data to prompt
- `validateAIResponse()` - Validates AI output structure

**System Prompt Features:**
- Expert gift recommendation persona
- Clear guidelines for personalization
- Confidence scoring rules
- JSON output format specification
- Avoids repetition of previous gifts

---

### **4. Supabase Edge Function** ✅
**File:** `/supabase/functions/generate-gift-suggestions/index.ts`

**What it does:**
- Handles single profile generation
- Handles batch generation (all profiles)
- Calls OpenAI API
- Saves suggestions to database
- Logs all generations
- Updates schedules
- Error handling & retry logic

**Endpoints:**
- Single: `POST /functions/v1/generate-gift-suggestions` with `{ "profileId": "uuid" }`
- Batch: `POST /functions/v1/generate-gift-suggestions` with `{ "batch": true }`

---

### **5. Environment Setup** ✅
**File:** `/supabase/functions/.env.example`

**Required variables:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Auto-provided by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-provided by Supabase

---

## 🔧 **Setup Instructions**

### **Step 1: Run Database Migration**

**Option A: Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Open `/supabase/migrations/20240125_ai_gift_generation_system.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"

**Option B: Supabase CLI**
```bash
cd /Users/blackpanther/Desktop/Rizzers
supabase db push
```

**Verify:**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_gift_generation_schedule');

-- Check schedules created for existing profiles
SELECT COUNT(*) FROM ai_gift_generation_schedule;
```

---

### **Step 2: Get OpenAI API Key**

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it "Rizzers Gift Generation"
4. Copy the key (starts with `sk-...`)
5. **Save it securely** - you can't see it again!

**Cost estimate:**
- Each generation: ~$0.0006 (less than a penny)
- 1,000 users × 5 runs/day × 30 days = ~$90/month

---

### **Step 3: Configure Supabase Edge Function**

**Add environment variable:**

1. Go to Supabase Dashboard
2. Navigate to: **Project Settings** → **Edge Functions**
3. Click "Add secret"
4. Add:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...` (your key from Step 2)
5. Click "Save"

---

### **Step 4: Deploy Edge Function**

```bash
cd /Users/blackpanther/Desktop/Rizzers

# Login to Supabase (if not already)
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy generate-gift-suggestions

# Verify deployment
supabase functions list
```

**Expected output:**
```
✓ Deployed function generate-gift-suggestions
  URL: https://your-project.supabase.co/functions/v1/generate-gift-suggestions
```

---

### **Step 5: Test the Function**

**Test single profile generation:**

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/generate-gift-suggestions \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"profileId": "some-profile-uuid"}'
```

**Expected response:**
```json
{
  "success": true,
  "profileId": "...",
  "suggestionsCount": 4,
  "duration_ms": 2341
}
```

**Check results in database:**
```sql
-- View generated suggestions
SELECT * FROM date_profile_ai_gift_suggestions 
WHERE date_profile_id = 'your-profile-id'
ORDER BY created_at DESC;

-- View generation log
SELECT * FROM ai_gift_generation_log 
ORDER BY created_at DESC 
LIMIT 10;
```

---

### **Step 6: Set Up Cron Jobs (Automation)**

**Option A: Supabase Cron (Recommended)**

Run this SQL in Supabase Dashboard:

```sql
-- Schedule generation 5 times per day
-- 8 AM
SELECT cron.schedule(
  'generate-gifts-8am',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- 12 PM
SELECT cron.schedule(
  'generate-gifts-12pm',
  '0 12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- 3 PM
SELECT cron.schedule(
  'generate-gifts-3pm',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- 6 PM
SELECT cron.schedule(
  'generate-gifts-6pm',
  '0 18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- 9 PM
SELECT cron.schedule(
  'generate-gifts-9pm',
  '0 21 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);
```

**Verify cron jobs:**
```sql
SELECT * FROM cron.job WHERE jobname LIKE 'generate-gifts%';
```

**Option B: GitHub Actions**

Create `.github/workflows/gift-generation.yml`:

```yaml
name: Generate Gift Suggestions
on:
  schedule:
    - cron: '0 8,12,15,18,21 * * *' # 8 AM, 12 PM, 3 PM, 6 PM, 9 PM UTC
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            ${{ secrets.SUPABASE_URL }}/functions/v1/generate-gift-suggestions \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"batch": true}'
```

---

## 📊 **Monitoring & Analytics**

### **Check Generation Stats**

```sql
-- Daily statistics
SELECT * FROM ai_gift_generation_stats 
ORDER BY generation_date DESC 
LIMIT 30;

-- User engagement
SELECT * FROM ai_gift_suggestion_engagement 
ORDER BY suggestion_date DESC 
LIMIT 30;

-- Recent generations
SELECT 
  date_profile_id,
  suggestions_count,
  generation_duration_ms,
  total_cost,
  status,
  created_at
FROM ai_gift_generation_log
ORDER BY created_at DESC
LIMIT 20;

-- Cost tracking
SELECT 
  DATE(created_at) as date,
  COUNT(*) as generations,
  SUM(total_cost) as daily_cost,
  AVG(generation_duration_ms) as avg_duration_ms
FROM ai_gift_generation_log
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### **Monitor Errors**

```sql
-- Failed generations
SELECT * FROM ai_gift_generation_log 
WHERE status = 'failed' 
ORDER BY created_at DESC 
LIMIT 10;

-- Profiles with low success rate
SELECT 
  date_profile_id,
  total_generations,
  successful_generations,
  failed_generations,
  ROUND(100.0 * successful_generations / NULLIF(total_generations, 0), 2) as success_rate
FROM ai_gift_generation_schedule
WHERE total_generations > 0
ORDER BY success_rate ASC
LIMIT 20;
```

---

## 🎯 **Testing Checklist**

### **Manual Testing:**

- [ ] Run migration successfully
- [ ] Add OpenAI API key to Supabase
- [ ] Deploy Edge Function
- [ ] Test single profile generation
- [ ] Verify suggestions saved to database
- [ ] Check generation log created
- [ ] Verify schedule updated
- [ ] Test batch generation (all profiles)
- [ ] Check error handling (invalid profile ID)
- [ ] Verify data quality check works

### **Automated Testing:**

- [ ] Set up cron jobs
- [ ] Wait for first automated run
- [ ] Check cron job logs
- [ ] Verify suggestions generated
- [ ] Monitor costs
- [ ] Check success rate

---

## 🚨 **Troubleshooting**

### **Problem: "OPENAI_API_KEY not configured"**
**Solution:** Add API key in Supabase Dashboard → Edge Functions → Secrets

### **Problem: "Insufficient data quality"**
**Solution:** Profile needs more data. Add interests, conversations, or notes.

### **Problem: "OpenAI API error: 429"**
**Solution:** Rate limit hit. Reduce batch size or add delays between requests.

### **Problem: "Invalid AI response format"**
**Solution:** Check OpenAI API response. May need to adjust prompt or model.

### **Problem: Cron jobs not running**
**Solution:** 
1. Check cron.job table
2. Verify service role key is correct
3. Check Edge Function logs
4. Ensure pg_cron extension is enabled

---

## 📈 **Success Metrics**

### **Week 1 Goals:**
- [ ] 100% of profiles have schedules
- [ ] >90% generation success rate
- [ ] <5 second average generation time
- [ ] <$10 total cost

### **Month 1 Goals:**
- [ ] >95% generation success rate
- [ ] >50% user engagement (clicks on AI banner)
- [ ] >30% save rate (suggestions saved to ideas)
- [ ] <$100 total cost

---

## 🎉 **Next Steps**

1. **Run migration** ✅
2. **Get OpenAI API key** ✅
3. **Deploy Edge Function** ⏳
4. **Test single generation** ⏳
5. **Set up cron jobs** ⏳
6. **Monitor first week** ⏳
7. **Add push notifications** (future)
8. **Optimize prompts** (ongoing)

---

## 📝 **Quick Reference**

### **Important URLs:**
- OpenAI Dashboard: https://platform.openai.com
- Supabase Dashboard: https://supabase.com/dashboard
- Edge Function: `https://your-project.supabase.co/functions/v1/generate-gift-suggestions`

### **Important Files:**
- Migration: `/supabase/migrations/20240125_ai_gift_generation_system.sql`
- Edge Function: `/supabase/functions/generate-gift-suggestions/index.ts`
- Data Gathering: `/lib/aiGiftDataGathering.ts`
- Prompts: `/lib/aiGiftPrompts.ts`

### **Key Commands:**
```bash
# Deploy function
supabase functions deploy generate-gift-suggestions

# View logs
supabase functions logs generate-gift-suggestions

# Test locally
supabase functions serve generate-gift-suggestions
```

---

**Everything is ready to deploy! Follow the steps above to get AI gift generation running!** 🚀
