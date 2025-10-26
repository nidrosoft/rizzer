# 🎁 Gifts & Ideas - Complete Implementation Plan

## 📋 **Executive Summary**

### **Feature Overview:**
AI-powered gift suggestion system that runs daily, generates 5 personalized gift ideas, and sends staggered notifications throughout the day. Users can manually add their own gift ideas and track gift history.

### **Key Components:**
1. **AI Gift Suggestions** - Daily automated suggestions (5 per day)
2. **Future Gift Ideas** - User-added gift ideas
3. **Gift History** - Track of given gifts
4. **Notification System** - Staggered notifications (9am, 12pm, 3pm, 6pm, etc.)
5. **Swipe Actions** - Delete user-added items only

---

## 🎯 **Current State Analysis**

### **Existing UI Structure:**

**✅ Already Built:**
- AI Suggestions Banner (top of page)
- AI Suggestions Modal (shows 4 suggestions)
- Future Ideas Tab (user-added ideas)
- Gift History Tab (given gifts)
- Add Gift Modal (form for new ideas)
- Tab switching (Ideas/History)

**❌ Needs Update:**
- Remove top-right menu (3 dots)
- Remove archive/delete for entire section
- Add swipe-to-delete for user items only
- Connect to database
- Implement AI generation system
- Add notification system
- Update to show 5 AI suggestions (not 4)

---

## 🗄️ **Database Structure**

### **1. AI Gift Suggestions Table**

```sql
CREATE TABLE date_profile_ai_gift_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Gift Details
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  price TEXT,
  occasion TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  product_link TEXT,
  
  -- AI Metadata
  generated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  generation_batch_id UUID, -- Groups suggestions from same daily run
  expires_at TIMESTAMP WITHOUT TIME ZONE, -- 24 hours from generation
  
  -- User Actions
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'saved', 'dismissed', 'expired')),
  saved_at TIMESTAMP WITHOUT TIME ZONE,
  dismissed_at TIMESTAMP WITHOUT TIME ZONE,
  
  -- Notifications
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITHOUT TIME ZONE,
  notification_opened BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_gifts_profile ON date_profile_ai_gift_suggestions(date_profile_id);
CREATE INDEX idx_ai_gifts_status ON date_profile_ai_gift_suggestions(status);
CREATE INDEX idx_ai_gifts_expires ON date_profile_ai_gift_suggestions(expires_at);
CREATE INDEX idx_ai_gifts_batch ON date_profile_ai_gift_suggestions(generation_batch_id);
CREATE INDEX idx_ai_gifts_notification ON date_profile_ai_gift_suggestions(notification_sent, notification_sent_at);

-- RLS Policies
ALTER TABLE date_profile_ai_gift_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI gift suggestions"
  ON date_profile_ai_gift_suggestions FOR SELECT
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own AI gift suggestions"
  ON date_profile_ai_gift_suggestions FOR UPDATE
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );
```

### **2. User Gift Ideas Table**

```sql
CREATE TABLE date_profile_gift_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Gift Details
  title TEXT NOT NULL,
  occasion TEXT,
  budget TEXT,
  notes TEXT,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  
  -- Status
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'purchased', 'given')),
  
  -- Dates
  target_date DATE,
  purchased_date DATE,
  given_date DATE,
  
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_gift_ideas_profile ON date_profile_gift_ideas(date_profile_id);
CREATE INDEX idx_gift_ideas_status ON date_profile_gift_ideas(status);
CREATE INDEX idx_gift_ideas_priority ON date_profile_gift_ideas(priority);

-- RLS Policies
ALTER TABLE date_profile_gift_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own gift ideas"
  ON date_profile_gift_ideas FOR ALL
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );
```

### **3. Gift History Table**

```sql
CREATE TABLE date_profile_gift_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Gift Details
  title TEXT NOT NULL,
  occasion TEXT,
  price TEXT,
  date_given DATE NOT NULL,
  
  -- Reaction/Feedback
  reaction TEXT,
  reaction_emoji TEXT,
  notes TEXT,
  
  -- Photos
  photos TEXT[], -- Array of photo URLs
  
  -- Source
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai_suggestion')),
  ai_suggestion_id UUID REFERENCES date_profile_ai_gift_suggestions(id),
  
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_gift_history_profile ON date_profile_gift_history(date_profile_id);
CREATE INDEX idx_gift_history_date ON date_profile_gift_history(date_given DESC);
CREATE INDEX idx_gift_history_source ON date_profile_gift_history(source);

-- RLS Policies
ALTER TABLE date_profile_gift_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own gift history"
  ON date_profile_gift_history FOR ALL
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );
```

### **4. AI Generation Log Table**

```sql
CREATE TABLE ai_gift_generation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL,
  
  -- Generation Details
  suggestions_count INTEGER DEFAULT 0,
  generation_duration_ms INTEGER,
  
  -- AI Model Info
  model_used TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  
  -- Status
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  error_message TEXT,
  
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_generation_log_profile ON ai_gift_generation_log(date_profile_id);
CREATE INDEX idx_generation_log_batch ON ai_gift_generation_log(batch_id);
CREATE INDEX idx_generation_log_created ON ai_gift_generation_log(created_at DESC);

-- RLS Policies
ALTER TABLE ai_gift_generation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation logs"
  ON ai_gift_generation_log FOR SELECT
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );
```

---

## 🤖 **AI Gift Generation System**

### **System Architecture:**

```
┌─────────────────────────────────────────┐
│     Daily Cron Job (9:00 AM UTC)        │
│  Triggers AI Generation for All Users   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   AI Gift Generation Service            │
│   - Fetches user profile data           │
│   - Analyzes interests, conversations   │
│   - Generates 5 personalized gifts      │
│   - Stores in database                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Notification Scheduler                │
│   - Schedules 5 notifications           │
│   - 9am, 12pm, 3pm, 6pm, 9pm           │
│   - One gift per notification           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Push Notification Service             │
│   - Sends notifications at intervals    │
│   - Tracks opens and interactions       │
└─────────────────────────────────────────┘
```

### **AI System Prompt:**

```typescript
const GIFT_SUGGESTION_SYSTEM_PROMPT = `
You are an AI gift suggestion assistant. Your goal is to generate personalized gift ideas based on a person's profile, interests, and relationship context.

CONTEXT PROVIDED:
- Name, age, profession
- Interests and hobbies
- Favorite things (colors, flowers, food, music)
- Dislikes
- Personality traits
- Recent conversations
- Past gifts given
- Upcoming occasions (birthday, anniversary, etc.)
- Budget preferences

YOUR TASK:
Generate exactly 5 unique, thoughtful gift suggestions that:
1. Are personalized to their specific interests
2. Match their personality and preferences
3. Fit appropriate occasions
4. Have realistic price ranges
5. Include a clear reason why this gift is suitable

OUTPUT FORMAT (JSON):
{
  "suggestions": [
    {
      "title": "Gift name",
      "reason": "Why this gift is perfect for them",
      "price": "$XX.XX or $XX-$XX",
      "occasion": "Birthday/Anniversary/Just Because/etc",
      "confidence": 85-100 (how confident you are this is a good match),
      "product_link": "Optional: real product URL if available"
    }
  ]
}

GUIDELINES:
- Be creative but practical
- Consider their budget
- Avoid gifts related to dislikes
- Prioritize upcoming occasions
- Mix price ranges (affordable to splurge)
- Include both physical gifts and experiences
- Ensure gifts are actually purchasable
- Provide specific product names, not generic categories
`;
```

### **AI Generation Function:**

```typescript
// /lib/aiGiftGeneration.ts

interface GiftSuggestion {
  title: string;
  reason: string;
  price: string;
  occasion: string;
  confidence: number;
  product_link?: string;
}

export async function generateDailyGiftSuggestions(
  profileId: string
): Promise<{
  success: boolean;
  suggestions?: GiftSuggestion[];
  error?: string;
}> {
  try {
    // 1. Fetch profile data
    const profileData = await getProfileDataForAI(profileId);
    
    // 2. Build AI prompt with profile context
    const prompt = buildGiftPrompt(profileData);
    
    // 3. Call AI API (OpenAI, Anthropic, etc.)
    const aiResponse = await callAIAPI(prompt);
    
    // 4. Parse and validate suggestions
    const suggestions = parseAISuggestions(aiResponse);
    
    // 5. Store in database
    const batchId = uuid();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    for (const suggestion of suggestions) {
      await supabase
        .from('date_profile_ai_gift_suggestions')
        .insert({
          date_profile_id: profileId,
          generation_batch_id: batchId,
          expires_at: expiresAt,
          ...suggestion,
        });
    }
    
    // 6. Log generation
    await logGeneration(profileId, batchId, suggestions.length);
    
    // 7. Schedule notifications
    await scheduleGiftNotifications(profileId, batchId, suggestions);
    
    return { success: true, suggestions };
  } catch (error: any) {
    console.error('AI gift generation failed:', error);
    return { success: false, error: error.message };
  }
}

async function getProfileDataForAI(profileId: string) {
  // Fetch all relevant data
  const { data: profile } = await supabase
    .from('date_profiles')
    .select(`
      *,
      date_profile_interests(*),
      date_profile_favorites(*),
      date_profile_conversations(*),
      date_profile_gift_history(*),
      date_profile_important_dates(*)
    `)
    .eq('id', profileId)
    .single();
    
  return profile;
}

function buildGiftPrompt(profileData: any): string {
  return `
${GIFT_SUGGESTION_SYSTEM_PROMPT}

PROFILE DATA:
Name: ${profileData.name}
Age: ${profileData.age}
Profession: ${profileData.profession}
Interests: ${profileData.date_profile_interests?.map(i => i.interest).join(', ')}
Favorite Color: ${profileData.favorite_color}
Favorite Flower: ${profileData.favorite_flower}
Favorite Foods: ${profileData.favorite_foods?.join(', ')}
Dislikes: ${profileData.dislikes?.join(', ')}
Personality: ${profileData.personality_traits?.join(', ')}

UPCOMING OCCASIONS:
${formatUpcomingOccasions(profileData.date_profile_important_dates)}

PAST GIFTS:
${formatPastGifts(profileData.date_profile_gift_history)}

Generate 5 personalized gift suggestions now.
  `;
}
```

---

## 📬 **Notification System**

### **Notification Schedule:**

```typescript
// /lib/giftNotifications.ts

const NOTIFICATION_TIMES = [
  { hour: 9, minute: 0 },   // 9:00 AM
  { hour: 12, minute: 0 },  // 12:00 PM
  { hour: 15, minute: 0 },  // 3:00 PM
  { hour: 18, minute: 0 },  // 6:00 PM
  { hour: 21, minute: 0 },  // 9:00 PM
];

export async function scheduleGiftNotifications(
  profileId: string,
  batchId: string,
  suggestions: GiftSuggestion[]
) {
  const { data: profile } = await supabase
    .from('date_profiles')
    .select('name, user_id')
    .eq('id', profileId)
    .single();
    
  const today = new Date();
  
  for (let i = 0; i < suggestions.length; i++) {
    const suggestion = suggestions[i];
    const notificationTime = NOTIFICATION_TIMES[i];
    
    const scheduledTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      notificationTime.hour,
      notificationTime.minute
    );
    
    // Schedule push notification
    await schedulePushNotification({
      userId: profile.user_id,
      title: `🎁 Gift Idea for ${profile.name}`,
      body: `${suggestion.title} - ${suggestion.reason}`,
      data: {
        type: 'ai_gift_suggestion',
        profileId,
        suggestionId: suggestion.id,
        batchId,
      },
      scheduledTime,
    });
  }
}

export async function sendGiftNotification(
  userId: string,
  suggestion: GiftSuggestion,
  profileName: string
) {
  // Send via Expo Push Notifications
  await sendPushNotification({
    to: await getUserPushToken(userId),
    title: `🎁 Gift Idea for ${profileName}`,
    body: `${suggestion.title} - ${suggestion.reason}`,
    data: {
      type: 'ai_gift_suggestion',
      suggestionId: suggestion.id,
    },
    badge: 1,
    sound: 'default',
  });
  
  // Mark as sent in database
  await supabase
    .from('date_profile_ai_gift_suggestions')
    .update({
      notification_sent: true,
      notification_sent_at: new Date().toISOString(),
    })
    .eq('id', suggestion.id);
}
```

### **Notification Content:**

**Example Notifications:**
```
9:00 AM:
🎁 Gift Idea for Sarah
Professional Hair Styling Kit - Based on her profession as a hair braider

12:00 PM:
🎁 Gift Idea for Sarah
Yoga Mat & Accessories Set - She mentioned wanting to try yoga

3:00 PM:
🎁 Gift Idea for Sarah
Sunflower Bouquet Subscription - Her favorite flower is sunflowers

6:00 PM:
🎁 Gift Idea for Sarah
Italian Cooking Class for Two - Loves Italian food & cooking together

9:00 PM:
🎁 Gift Idea for Sarah
Photography Workshop - She's passionate about photography
```

---

## 🎨 **UI/UX Updates**

### **Changes Needed:**

**1. Remove Top-Right Menu:**
```typescript
// REMOVE:
<TouchableOpacity style={styles.navButton} onPress={handleMenu}>
  <More size={24} color={Colors.text} variant="Outline" />
</TouchableOpacity>

// REMOVE:
<CategoryActionSheet ... />
```

**2. Update AI Banner:**
```typescript
// Change from 4 to 5 suggestions
<Text style={styles.aiBannerSubtitle}>
  {aiSuggestions.length} personalized ideas
</Text>
```

**3. Add Swipe-to-Delete:**
```typescript
import Swipeable from 'react-native-gesture-handler/Swipeable';

// For user-added ideas only
<Swipeable
  renderRightActions={() => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => handleDeleteIdea(idea.id)}
    >
      <Trash size={24} color={Colors.textWhite} />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  )}
>
  <View style={styles.ideaCard}>
    {/* Idea content */}
  </View>
</Swipeable>
```

**4. Add Long-Press for History:**
```typescript
<TouchableOpacity
  style={styles.historyCard}
  onLongPress={() => handleLongPress(gift.id)}
  delayLongPress={500}
>
  {/* History content */}
</TouchableOpacity>

// Show action sheet on long press
const handleLongPress = (giftId: string) => {
  Alert.alert(
    'Gift Options',
    'What would you like to do?',
    [
      { text: 'Delete', onPress: () => handleDeleteGift(giftId), style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};
```

**5. AI Suggestions - No Delete:**
```typescript
// AI suggestions in modal are READ-ONLY
// Users can only:
// - View Product (opens link)
// - Add to Ideas (saves to their ideas)
// - Dismiss (marks as dismissed, not deleted)
```

---

## 🔄 **Data Flow**

### **Daily AI Generation Flow:**

```
1. Cron Job (9:00 AM UTC)
   ↓
2. For each active date profile:
   - Fetch profile data
   - Generate 5 AI suggestions
   - Store with 24h expiration
   ↓
3. Schedule 5 notifications:
   - 9am, 12pm, 3pm, 6pm, 9pm
   ↓
4. Send notifications at intervals
   ↓
5. User opens notification
   ↓
6. Navigate to Gifts & Ideas page
   ↓
7. Show AI suggestions banner
   ↓
8. User can:
   - View suggestions
   - Save to ideas
   - Dismiss
   - Open product link
```

### **User Actions Flow:**

```
USER ADDS IDEA:
1. Tap + button
2. Fill form (title, occasion, budget, priority, notes)
3. Save
4. Store in date_profile_gift_ideas
5. Show in Future Ideas tab
6. User can swipe to delete

USER GIVES GIFT:
1. Mark idea as "given"
2. Move to gift history
3. Add reaction/notes
4. Store in date_profile_gift_history
5. Show in Gift History tab
6. User can long-press to delete

AI SUGGESTION ACTIONS:
1. View Product → Open link in browser
2. Add to Ideas → Copy to date_profile_gift_ideas
3. Dismiss → Mark as dismissed (not deleted)
4. Expire → Auto-expire after 24 hours
```

---

## 📱 **Backend Functions**

### **Functions to Create:**

```typescript
// /lib/gifts.ts

// AI Suggestions
export async function getAIGiftSuggestions(profileId: string)
export async function dismissAISuggestion(suggestionId: string)
export async function saveAISuggestionToIdeas(suggestionId: string)
export async function markAISuggestionOpened(suggestionId: string)

// User Ideas
export async function getUserGiftIdeas(profileId: string)
export async function createGiftIdea(data: CreateGiftIdeaInput)
export async function updateGiftIdea(id: string, data: UpdateGiftIdeaInput)
export async function deleteGiftIdea(id: string)
export async function markIdeaAsGiven(id: string, giftData: GiftHistoryInput)

// Gift History
export async function getGiftHistory(profileId: string)
export async function createGiftHistory(data: CreateGiftHistoryInput)
export async function updateGiftHistory(id: string, data: UpdateGiftHistoryInput)
export async function deleteGiftHistory(id: string)

// AI Generation (Backend/Cron)
export async function generateDailyGiftSuggestions(profileId: string)
export async function expireOldSuggestions()
export async function getGenerationStats(profileId: string)
```

---

## 🚀 **Implementation Phases**

### **Phase 1: Database Setup** (Day 1)
- [ ] Create migration files
- [ ] Create all 4 tables
- [ ] Set up RLS policies
- [ ] Create indexes
- [ ] Test database structure

### **Phase 2: Backend Functions** (Day 2-3)
- [ ] Create CRUD functions for gift ideas
- [ ] Create CRUD functions for gift history
- [ ] Create AI suggestion functions
- [ ] Create notification scheduling
- [ ] Test all functions

### **Phase 3: UI Updates** (Day 4-5)
- [ ] Remove top-right menu
- [ ] Add swipe-to-delete for ideas
- [ ] Add long-press for history
- [ ] Update AI banner to show 5
- [ ] Connect to database
- [ ] Add loading states
- [ ] Add error handling

### **Phase 4: AI Integration** (Day 6-7)
- [ ] Set up AI API (OpenAI/Anthropic)
- [ ] Create system prompt
- [ ] Build prompt generation
- [ ] Test AI generation
- [ ] Implement daily cron job
- [ ] Test expiration logic

### **Phase 5: Notifications** (Day 8-9)
- [ ] Set up Expo Push Notifications
- [ ] Create notification scheduler
- [ ] Test notification delivery
- [ ] Implement notification tracking
- [ ] Test deep linking

### **Phase 6: Testing & Polish** (Day 10)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling
- [ ] User feedback
- [ ] Documentation

---

## 📊 **Success Metrics**

### **AI System:**
- 5 suggestions generated daily per profile
- 95%+ generation success rate
- < 10 seconds generation time
- 85%+ average confidence score

### **Notifications:**
- 5 notifications sent per day
- 30%+ open rate
- Delivered at correct times
- No duplicate notifications

### **User Engagement:**
- 50%+ users view AI suggestions
- 20%+ users save suggestions to ideas
- 10%+ users mark ideas as given
- 5%+ users add manual ideas

---

## 🎯 **Summary**

### **What We're Building:**

**AI Gift System:**
- Daily AI generation (5 suggestions)
- 24-hour expiration
- Staggered notifications
- Confidence scoring
- Product links

**User Management:**
- Add gift ideas manually
- Track gift history
- Swipe to delete (user items only)
- Priority levels
- Budget tracking

**Notifications:**
- 5 per day (9am, 12pm, 3pm, 6pm, 9pm)
- One gift per notification
- Deep linking to app
- Open tracking

**Database:**
- 4 new tables
- RLS policies
- Proper indexing
- Expiration logic

This is a complete, production-ready system that will delight users with personalized gift suggestions while giving them full control over their own gift planning! 🎁
