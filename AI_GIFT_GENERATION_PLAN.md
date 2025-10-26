# 🤖 AI Gift Generation System - Complete Implementation Plan

## 📋 **Executive Summary**

**Goal:** Automatically generate personalized gift suggestions 5 times per day using AI, analyzing user's date profile data (interests, conversations, memories, notes, dates, etc.) to create highly relevant gift recommendations.

**Status:** 🔵 **Planning Phase - Ready for Implementation**

---

## 🎯 **System Overview**

### **What It Does:**
- Analyzes all date profile data (interests, conversations, memories, notes, dates, favorites)
- Generates 3-5 personalized gift suggestions per profile
- Runs 5 times per day at optimal times
- Expires old suggestions after 24 hours
- Tracks generation metrics and costs
- Sends push notifications when new suggestions are ready

### **Key Features:**
- ✅ Personalized based on real data
- ✅ Confidence scoring (85-95% match)
- ✅ Price estimation
- ✅ Occasion matching
- ✅ Product link suggestions
- ✅ Reasoning explanation
- ✅ 24-hour expiration
- ✅ Cost tracking
- ✅ Performance monitoring

---

## 🤖 **AI Model Selection**

### **Recommended: OpenAI GPT-4o-mini**

**Why GPT-4o-mini:**
1. **Cost-Effective:** ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
2. **Fast:** ~2-3 seconds per generation
3. **Smart:** Excellent reasoning and personalization
4. **Structured Output:** Supports JSON mode for reliable parsing
5. **Context Window:** 128K tokens (plenty for all profile data)
6. **Proven:** Battle-tested for similar use cases

**Cost Estimation:**
- Input: ~2,000 tokens per profile (all data)
- Output: ~500 tokens per generation (5 suggestions)
- **Cost per generation:** ~$0.0006 (less than a penny!)
- **Daily cost (5 runs):** ~$0.003 per profile
- **Monthly cost:** ~$0.09 per profile
- **For 1,000 active users:** ~$90/month

**Alternative Options:**
- **GPT-4o:** More expensive but higher quality ($2.50/$10 per 1M tokens)
- **Claude 3.5 Sonnet:** Excellent quality, similar pricing ($3/$15 per 1M tokens)
- **Gemini 1.5 Flash:** Cheaper but less consistent ($0.075/$0.30 per 1M tokens)

**Recommendation:** Start with GPT-4o-mini, upgrade to GPT-4o for premium users later.

---

## 📊 **Data Sources for AI Analysis**

### **What Data to Analyze:**

1. **Date Profile Basics**
   - Name, age, relationship status
   - How you met, relationship start date
   - Favorite color, flower, food, drink, music, movie

2. **Interests & Hobbies**
   - All interests from `date_profile_interests` table
   - Categories: Sports, Arts, Music, Food, Travel, etc.

3. **Conversations**
   - Recent conversations from `date_profile_conversations`
   - Topics discussed, important mentions
   - Last 10-20 conversations for context

4. **Memories**
   - Special moments from `date_profile_memories`
   - Photos, descriptions, dates
   - Emotional significance

5. **Notes**
   - User notes from `date_profile_notes`
   - Important observations, preferences
   - Things they mentioned wanting

6. **Dates History**
   - Past dates from `date_profile_dates`
   - Activities they enjoyed
   - Places they liked

7. **Gift History**
   - Previous gifts from `date_profile_gift_history`
   - What worked well (reactions)
   - What to avoid repeating

8. **Current Gift Ideas**
   - Existing ideas from `date_profile_gift_ideas`
   - To avoid duplicates

### **Data Fetching Strategy:**
```typescript
async function gatherProfileDataForAI(profileId: string) {
  const [
    profile,
    interests,
    conversations,
    memories,
    notes,
    dates,
    giftHistory,
    giftIdeas,
  ] = await Promise.all([
    getDateProfile(profileId),
    getInterests(profileId),
    getRecentConversations(profileId, 20), // Last 20
    getRecentMemories(profileId, 10), // Last 10
    getRecentNotes(profileId, 10), // Last 10
    getRecentDates(profileId, 10), // Last 10
    getGiftHistory(profileId),
    getGiftIdeas(profileId),
  ]);

  return {
    profile,
    interests,
    conversations,
    memories,
    notes,
    dates,
    giftHistory,
    giftIdeas,
  };
}
```

---

## 🎨 **System Prompt Design**

### **Master System Prompt:**

```
You are an expert gift recommendation AI specializing in personalized gift suggestions for romantic relationships. Your goal is to analyze a person's profile data and generate thoughtful, meaningful gift ideas that show deep understanding and care.

## Your Task:
Analyze the provided profile data and generate 3-5 highly personalized gift suggestions. Each suggestion should:
1. Be based on specific data points from their profile
2. Show genuine understanding of their interests and preferences
3. Be appropriate for the relationship stage and upcoming occasions
4. Include a confidence score (85-100%) based on data strength
5. Have a clear reasoning that references specific profile information

## Data You'll Receive:
- Basic profile information (name, age, relationship details, favorites)
- Interests and hobbies
- Recent conversations and topics discussed
- Special memories and moments
- User notes and observations
- Past dates and activities
- Previous gift history (to avoid repetition)
- Current gift ideas (to avoid duplicates)

## Guidelines:
1. **Personalization is Key:** Every suggestion must tie back to specific profile data
2. **Variety:** Suggest different types of gifts (experiences, physical items, subscriptions)
3. **Price Range:** Mix of affordable ($20-50), mid-range ($50-150), and special ($150+)
4. **Occasions:** Consider upcoming events (birthday, anniversary, holidays, "just because")
5. **Avoid Repetition:** Don't suggest gifts similar to what they've already received
6. **Be Specific:** "Professional Hair Styling Kit" not "Hair Products"
7. **Include Links:** When possible, suggest where to buy (Amazon, Etsy, specific stores)
8. **Confidence Scoring:**
   - 95-100%: Direct mention or strong pattern
   - 90-94%: Clear interest with supporting evidence
   - 85-89%: Inferred from related interests

## Output Format:
Return a JSON array of gift suggestions with this structure:
{
  "suggestions": [
    {
      "title": "Specific gift name",
      "reason": "Why this gift based on profile data",
      "price": "$XX.XX or price range",
      "occasion": "Birthday/Anniversary/Just Because/etc",
      "confidence_score": 85-100,
      "product_link": "URL or null",
      "category": "Experience/Physical/Subscription/etc"
    }
  ]
}

## Important:
- Be thoughtful and genuine
- Reference specific profile details in reasoning
- Avoid generic suggestions
- Consider relationship stage and appropriateness
- Make each suggestion feel personal and meaningful
```

### **User Prompt Template:**

```typescript
function buildUserPrompt(data: ProfileData): string {
  return `
# Profile Analysis Request

## Basic Information:
- Name: ${data.profile.name}
- Age: ${data.profile.age}
- Relationship Status: ${data.profile.relationship_status}
- How We Met: ${data.profile.how_we_met}
- Relationship Start: ${data.profile.relationship_start_date}

## Favorites:
- Favorite Color: ${data.profile.favorite_color}
- Favorite Flower: ${data.profile.favorite_flower}
- Favorite Food: ${data.profile.favorite_food}
- Favorite Drink: ${data.profile.favorite_drink}
- Favorite Music: ${data.profile.favorite_music}
- Favorite Movie: ${data.profile.favorite_movie}

## Interests & Hobbies:
${data.interests.map(i => `- ${i.category}: ${i.name}`).join('\n')}

## Recent Conversations (Last 20):
${data.conversations.map(c => `- ${c.date}: ${c.topic} - ${c.summary}`).join('\n')}

## Special Memories:
${data.memories.map(m => `- ${m.date}: ${m.title} - ${m.description}`).join('\n')}

## Important Notes:
${data.notes.map(n => `- ${n.title}: ${n.content}`).join('\n')}

## Past Dates & Activities:
${data.dates.map(d => `- ${d.date}: ${d.activity} at ${d.location}`).join('\n')}

## Previous Gifts (to avoid repetition):
${data.giftHistory.map(g => `- ${g.title} (${g.occasion}) - Reaction: ${g.reaction}`).join('\n')}

## Current Gift Ideas (to avoid duplicates):
${data.giftIdeas.map(i => `- ${i.title} (${i.priority})`).join('\n')}

---

Based on this comprehensive profile, generate 3-5 highly personalized gift suggestions. Make each suggestion thoughtful, specific, and tied to concrete data points from the profile above.
`;
}
```

---

## ⚙️ **Implementation Architecture**

### **1. Edge Function (Supabase)**

**File:** `/supabase/functions/generate-gift-suggestions/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { profileId } = await req.json();
    
    // 1. Gather all profile data
    const profileData = await gatherProfileDataForAI(profileId);
    
    // 2. Call OpenAI API
    const suggestions = await generateSuggestionsWithAI(profileData);
    
    // 3. Save to database
    const batchId = crypto.randomUUID();
    await saveSuggestionsToDatabase(profileId, suggestions, batchId);
    
    // 4. Log generation
    await logGeneration(profileId, batchId, suggestions.length);
    
    // 5. Send notification (optional)
    await sendNotification(profileId, suggestions.length);
    
    return new Response(
      JSON.stringify({ success: true, count: suggestions.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

### **2. Cron Job Setup**

**Schedule:** 5 times per day at optimal times
- 8:00 AM (morning commute)
- 12:00 PM (lunch break)
- 3:00 PM (afternoon)
- 6:00 PM (evening)
- 9:00 PM (night)

**Implementation Options:**

**Option A: Supabase Cron (Recommended)**
```sql
-- In Supabase SQL Editor
SELECT cron.schedule(
  'generate-gift-suggestions-morning',
  '0 8 * * *', -- 8 AM daily
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/generate-gift-suggestions',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  );
  $$
);

-- Repeat for other times (12 PM, 3 PM, 6 PM, 9 PM)
```

**Option B: External Cron (Vercel Cron, GitHub Actions)**
```yaml
# .github/workflows/gift-generation.yml
name: Generate Gift Suggestions
on:
  schedule:
    - cron: '0 8,12,15,18,21 * * *' # 5 times daily
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            https://your-project.supabase.co/functions/v1/generate-gift-suggestions \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}"
```

### **3. Batch Processing**

**Strategy:** Process profiles in batches to avoid rate limits

```typescript
async function processBatch(profileIds: string[]) {
  const BATCH_SIZE = 10; // Process 10 at a time
  const DELAY_MS = 1000; // 1 second between batches
  
  for (let i = 0; i < profileIds.length; i += BATCH_SIZE) {
    const batch = profileIds.slice(i, i + BATCH_SIZE);
    
    await Promise.all(
      batch.map(profileId => generateForProfile(profileId))
    );
    
    if (i + BATCH_SIZE < profileIds.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
}
```

---

## 🗄️ **Database Changes Needed**

### **1. Add Generation Scheduling Table**

```sql
CREATE TABLE IF NOT EXISTS ai_gift_generation_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Schedule settings
  enabled BOOLEAN DEFAULT TRUE,
  frequency TEXT DEFAULT 'daily_5x' CHECK (frequency IN ('daily_5x', 'daily_3x', 'daily_1x', 'disabled')),
  
  -- Last generation tracking
  last_generated_at TIMESTAMP WITH TIME ZONE,
  next_scheduled_at TIMESTAMP WITH TIME ZONE,
  
  -- Generation stats
  total_generations INTEGER DEFAULT 0,
  successful_generations INTEGER DEFAULT 0,
  failed_generations INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generation_schedule_profile ON ai_gift_generation_schedule(date_profile_id);
CREATE INDEX idx_generation_schedule_next ON ai_gift_generation_schedule(next_scheduled_at);
CREATE INDEX idx_generation_schedule_enabled ON ai_gift_generation_schedule(enabled);
```

### **2. Add API Keys Table (Secure)**

```sql
CREATE TABLE IF NOT EXISTS ai_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  key_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL, -- Encrypted with Supabase Vault
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Usage tracking
  requests_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 4) DEFAULT 0,
  
  -- Rate limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Enhance Generation Log Table**

Already exists, but add these columns:

```sql
ALTER TABLE ai_gift_generation_log ADD COLUMN IF NOT EXISTS profile_data_snapshot JSONB;
ALTER TABLE ai_gift_generation_log ADD COLUMN IF NOT EXISTS ai_response_raw TEXT;
ALTER TABLE ai_gift_generation_log ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
```

---

## 🔧 **Backend Functions to Add**

### **File:** `/lib/aiGiftGeneration.ts`

```typescript
/**
 * AI Gift Generation Service
 * Handles AI-powered gift suggestion generation
 */

import OpenAI from 'openai';
import { createClient } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGiftSuggestions(profileId: string) {
  const startTime = Date.now();
  const batchId = crypto.randomUUID();
  
  try {
    // 1. Gather profile data
    const profileData = await gatherProfileDataForAI(profileId);
    
    // 2. Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profileData);
    
    // 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8, // Creative but consistent
      max_tokens: 1500,
    });
    
    const suggestions = JSON.parse(response.choices[0].message.content);
    const duration = Date.now() - startTime;
    
    // 4. Save suggestions
    await saveSuggestionsToDatabase(profileId, suggestions.suggestions, batchId);
    
    // 5. Log generation
    await logGeneration({
      profileId,
      batchId,
      suggestionsCount: suggestions.suggestions.length,
      duration,
      model: 'gpt-4o-mini',
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      cost: calculateCost(response.usage),
      status: 'success',
    });
    
    return { success: true, count: suggestions.suggestions.length };
  } catch (error) {
    await logGeneration({
      profileId,
      batchId,
      status: 'failed',
      errorMessage: error.message,
    });
    
    throw error;
  }
}

function calculateCost(usage: any): number {
  const INPUT_COST = 0.15 / 1_000_000; // $0.15 per 1M tokens
  const OUTPUT_COST = 0.60 / 1_000_000; // $0.60 per 1M tokens
  
  return (
    usage.prompt_tokens * INPUT_COST +
    usage.completion_tokens * OUTPUT_COST
  );
}
```

---

## 📱 **Push Notifications**

### **When to Send:**
- After new suggestions are generated
- Only if user has notifications enabled
- Only if there are new suggestions (not empty)

### **Notification Content:**
```typescript
{
  title: "🎁 New Gift Ideas for [Name]",
  body: "We found 4 personalized gift suggestions based on recent conversations",
  data: {
    type: 'gift_suggestions',
    profileId: 'uuid',
    count: 4,
    screen: '/date-profile/categories/gifts',
  }
}
```

---

## 🔒 **Security & Privacy**

### **Data Protection:**
1. **Encryption:** All API keys encrypted with Supabase Vault
2. **RLS:** Row-level security on all tables
3. **Rate Limiting:** Max 5 generations per profile per day
4. **Data Minimization:** Only send necessary data to AI
5. **Audit Logging:** Track all AI API calls

### **User Control:**
1. **Opt-in/Opt-out:** Users can disable AI suggestions
2. **Data Deletion:** Delete all AI suggestions on request
3. **Transparency:** Show what data is used for suggestions

---

## 📈 **Monitoring & Analytics**

### **Key Metrics to Track:**

1. **Generation Metrics:**
   - Total generations per day
   - Success rate
   - Average duration
   - Error rate

2. **Cost Metrics:**
   - Daily/monthly AI costs
   - Cost per profile
   - Token usage

3. **Quality Metrics:**
   - User engagement (clicks on suggestions)
   - Save rate (suggestions saved to ideas)
   - Dismiss rate
   - Confidence score distribution

4. **Performance Metrics:**
   - API response time
   - Database query time
   - End-to-end generation time

### **Dashboard Queries:**

```sql
-- Daily generation stats
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_generations,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
  AVG(generation_duration_ms) as avg_duration_ms,
  SUM(total_cost) as total_cost_usd
FROM ai_gift_generation_log
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- User engagement stats
SELECT 
  COUNT(DISTINCT date_profile_id) as profiles_with_suggestions,
  AVG(confidence_score) as avg_confidence,
  SUM(CASE WHEN status = 'saved' THEN 1 ELSE 0 END) as total_saved,
  SUM(CASE WHEN status = 'dismissed' THEN 1 ELSE 0 END) as total_dismissed
FROM date_profile_ai_gift_suggestions
WHERE created_at >= NOW() - INTERVAL '7 days';
```

---

## 🚀 **Implementation Phases**

### **Phase 1: Foundation (Week 1)**
- ✅ Database tables already exist
- ⏳ Add generation schedule table
- ⏳ Add API keys table
- ⏳ Set up OpenAI account and API key
- ⏳ Create system prompt and test manually

### **Phase 2: Core Generation (Week 2)**
- ⏳ Build data gathering functions
- ⏳ Create Edge Function for generation
- ⏳ Implement OpenAI integration
- ⏳ Test with sample profiles
- ⏳ Add error handling and logging

### **Phase 3: Automation (Week 3)**
- ⏳ Set up cron jobs (5x daily)
- ⏳ Implement batch processing
- ⏳ Add rate limiting
- ⏳ Test scheduling system
- ⏳ Monitor first week of automated runs

### **Phase 4: Notifications & Polish (Week 4)**
- ⏳ Integrate push notifications
- ⏳ Add user settings (enable/disable)
- ⏳ Create monitoring dashboard
- ⏳ Optimize prompts based on results
- ⏳ Launch to beta users

---

## 💰 **Cost Projections**

### **Assumptions:**
- 1,000 active users
- 5 generations per day per user
- Average 2,000 input tokens + 500 output tokens per generation

### **Monthly Costs:**

**AI API (GPT-4o-mini):**
- Input: 1,000 users × 5 runs × 30 days × 2,000 tokens = 300M tokens
- Output: 1,000 users × 5 runs × 30 days × 500 tokens = 75M tokens
- **Input cost:** 300M × $0.15/1M = $45
- **Output cost:** 75M × $0.60/1M = $45
- **Total AI cost:** $90/month

**Infrastructure:**
- Supabase Edge Functions: Free tier (500K invocations/month)
- Database storage: ~$5/month
- **Total infrastructure:** $5/month

**Grand Total:** ~$95/month for 1,000 users = **$0.095 per user/month**

### **Scaling:**
- 10,000 users: ~$950/month ($0.095/user)
- 100,000 users: ~$9,500/month ($0.095/user)

**Revenue Model:**
- Free tier: 1 generation per day
- Premium tier ($4.99/month): 5 generations per day
- Cost per premium user: $0.095
- Profit per premium user: $4.90
- **Margin: 98%** 🎉

---

## ✅ **Testing Strategy**

### **Unit Tests:**
- Test data gathering functions
- Test prompt building
- Test suggestion parsing
- Test database operations

### **Integration Tests:**
- Test full generation flow
- Test error handling
- Test rate limiting
- Test cron scheduling

### **Quality Tests:**
- Manual review of 100 generated suggestions
- User feedback surveys
- A/B test different prompts
- Track save/dismiss rates

---

## 🎯 **Success Metrics**

### **Technical Success:**
- ✅ 99% uptime for generation service
- ✅ <5 second average generation time
- ✅ <1% error rate
- ✅ <$100/month for 1,000 users

### **User Success:**
- ✅ >50% of users engage with suggestions
- ✅ >30% save rate (suggestions saved to ideas)
- ✅ <20% dismiss rate
- ✅ >85% average confidence score

### **Business Success:**
- ✅ Increase premium conversions by 20%
- ✅ Increase user retention by 15%
- ✅ Positive user feedback (>4.5 stars)

---

## 📝 **Next Steps**

### **Immediate Actions:**
1. ✅ Review and approve this plan
2. ⏳ Set up OpenAI account and get API key
3. ⏳ Create database tables (schedule, API keys)
4. ⏳ Build data gathering functions
5. ⏳ Test system prompt manually with sample data

### **This Week:**
1. Implement Edge Function
2. Test generation with 5-10 profiles
3. Refine system prompt based on results
4. Set up basic monitoring

### **Next Week:**
1. Set up cron jobs
2. Test automated generation
3. Add push notifications
4. Launch to beta users

---

**This plan is comprehensive, cost-effective, and production-ready. Ready to implement!** 🚀
