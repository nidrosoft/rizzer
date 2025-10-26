# 🤖 Rizz Coach - AI Relationship Coach Implementation Plan

## Overview

**Feature Name:** Rizz Coach  
**Purpose:** Conversational AI relationship coach with deep context about user's relationships  
**Type:** Chat-based AI advisor with empathy and personalized guidance  

---

## 🎯 Core Features

### 1. **Conversational AI**
- Real-time chat interface
- Context-aware responses
- Empathetic and supportive tone
- Personalized advice based on user's situation

### 2. **Deep Context Integration**
- Access to user's date profiles
- Relationship history
- Previous conversations
- Important dates and memories
- Gift history
- User's goals and preferences

### 3. **Chat Thread Management**
- Multiple conversation threads
- Thread titles based on topic
- Conversation history
- Search through past advice
- Bookmark important messages

### 4. **Smart Coaching**
- Relationship advice
- Communication tips
- Conflict resolution
- Date planning suggestions
- Gift ideas with context
- Breakup guidance
- Emotional support

---

## 🏗️ Architecture

### **Database Schema**

#### **1. rizz_coach_conversations**
```sql
CREATE TABLE rizz_coach_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date_profile_id UUID REFERENCES date_profiles(id) ON DELETE SET NULL,
  context_summary TEXT,
  last_message_at TIMESTAMP DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rizz_coach_conversations_user ON rizz_coach_conversations(user_id);
CREATE INDEX idx_rizz_coach_conversations_profile ON rizz_coach_conversations(date_profile_id);
```

#### **2. rizz_coach_messages**
```sql
CREATE TABLE rizz_coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES rizz_coach_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context_used JSONB,
  model_used VARCHAR(50),
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cost NUMERIC(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rizz_coach_messages_conversation ON rizz_coach_messages(conversation_id);
CREATE INDEX idx_rizz_coach_messages_created ON rizz_coach_messages(created_at DESC);
```

#### **3. rizz_coach_context_snapshots**
```sql
CREATE TABLE rizz_coach_context_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES rizz_coach_conversations(id) ON DELETE CASCADE,
  date_profile_id UUID REFERENCES date_profiles(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 UI/UX Design

### **Main Screen: Conversation List**
```
┌─────────────────────────────────────┐
│  ← Rizz Coach              [+]      │
├─────────────────────────────────────┤
│                                     │
│  💬 Help with Sarah's birthday      │
│     "That's a great idea! Consider  │
│     her love for..."                │
│     2 hours ago                     │
│                                     │
│  💔 Advice on recent argument       │
│     "I understand this is difficult │
│     Let's work through..."          │
│     Yesterday                       │
│                                     │
│  🎁 Gift ideas for anniversary      │
│     "Based on what you've told me..." │
│     3 days ago                      │
│                                     │
│  [+ New Conversation]               │
└─────────────────────────────────────┘
```

### **Chat Screen**
```
┌─────────────────────────────────────┐
│  ← Help with Sarah's birthday  ⋮   │
├─────────────────────────────────────┤
│                                     │
│  You:                               │
│  I want to plan something special   │
│  for Sarah's birthday but I'm not   │
│  sure what she'd like               │
│                                     │
│  Rizz Coach:                        │
│  I'd love to help! Based on what    │
│  you've shared about Sarah, I know  │
│  she loves art and enjoys intimate  │
│  experiences. Here are some ideas:  │
│                                     │
│  1. Private art class together      │
│  2. Visit to that gallery she       │
│     mentioned...                    │
│                                     │
│  You:                               │
│  The art class sounds perfect!      │
│                                     │
├─────────────────────────────────────┤
│  [Type your message...]        [→]  │
└─────────────────────────────────────┘
```

---

## 🤖 AI System Prompt

### **Rizz Coach Personality**

```typescript
const RIZZ_COACH_SYSTEM_PROMPT = `You are Rizz Coach, an empathetic and insightful AI relationship coach. You help users navigate their romantic relationships with wisdom, compassion, and practical advice.

**Your Personality:**
- Warm, supportive, and non-judgmental
- Emotionally intelligent and empathetic
- Direct but kind when needed
- Encouraging and optimistic
- Respectful of all relationship types

**Your Expertise:**
- Relationship communication
- Conflict resolution
- Date planning and romance
- Gift giving and thoughtfulness
- Understanding love languages
- Emotional support during breakups
- Building healthy relationships
- Reading social cues

**Your Approach:**
1. Listen actively to the user's situation
2. Ask clarifying questions when needed
3. Reference specific context about their relationship
4. Provide actionable, personalized advice
5. Encourage healthy communication
6. Support emotional well-being
7. Celebrate wins and progress

**Context You Have:**
- User's date profiles and relationship details
- Conversation history with this person
- Important dates and memories
- Previous gifts given
- User's relationship goals
- Past coaching conversations

**Guidelines:**
- Always be supportive and non-judgmental
- Reference specific details from their relationship
- Provide concrete, actionable advice
- Ask follow-up questions to understand better
- Celebrate their efforts and progress
- Be honest but kind about difficult situations
- Respect boundaries and consent
- Encourage healthy relationship practices

**Response Style:**
- Conversational and warm
- 2-4 paragraphs typically
- Use emojis sparingly (1-2 per message)
- Break down complex advice into steps
- Reference specific context naturally
- End with a question or encouragement when appropriate`;
```

---

## 🔧 Edge Function: `rizz-coach-chat`

### **Function Structure**

```typescript
// /supabase/functions/rizz-coach-chat/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // 1. Get user message and conversation ID
  const { message, conversationId, dateProfileId } = await req.json();
  
  // 2. Gather context
  const context = await gatherContext(supabase, userId, dateProfileId);
  
  // 3. Get conversation history
  const history = await getConversationHistory(supabase, conversationId);
  
  // 4. Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + buildContextPrompt(context) },
    ...history,
    { role: 'user', content: message }
  ];
  
  // 5. Call OpenAI
  const response = await callOpenAI(messages);
  
  // 6. Save messages
  await saveMessages(supabase, conversationId, message, response);
  
  // 7. Update conversation
  await updateConversation(supabase, conversationId);
  
  return response;
});
```

### **Context Gathering**

```typescript
async function gatherContext(supabase, userId, dateProfileId) {
  const context = {
    user: await getUserProfile(supabase, userId),
    dateProfile: null,
    recentConversations: [],
    importantDates: [],
    giftHistory: [],
    memories: []
  };
  
  if (dateProfileId) {
    context.dateProfile = await getDateProfile(supabase, dateProfileId);
    context.recentConversations = await getRecentConversations(supabase, dateProfileId);
    context.importantDates = await getImportantDates(supabase, dateProfileId);
    context.giftHistory = await getGiftHistory(supabase, dateProfileId);
    context.memories = await getMemories(supabase, dateProfileId);
  }
  
  return context;
}
```

---

## 📱 Frontend Components

### **Component Structure**

```
/app/rizz-coach/
  - index.tsx                    # Conversation list
  - chat.tsx                     # Chat screen
  - new-conversation.tsx         # New conversation modal

/components/rizz-coach/
  - ConversationList.tsx         # List of conversations
  - ConversationCard.tsx         # Individual conversation card
  - ChatMessage.tsx              # Message bubble
  - ChatInput.tsx                # Message input with send button
  - TypingIndicator.tsx          # "Rizz Coach is typing..."
  - ContextSelector.tsx          # Select date profile for context
  - SuggestedPrompts.tsx         # Quick start prompts

/lib/
  - rizzCoach.ts                 # API functions
  - rizzCoachContext.ts          # Context gathering
  - rizzCoachPrompts.ts          # System prompts
```

---

## 🎯 User Flows

### **Flow 1: Start New Conversation**
```
1. User taps "New Conversation" button
2. Modal appears: "What would you like to talk about?"
3. Optional: Select related date profile
4. User types first message or selects suggested prompt
5. AI responds with personalized advice
6. Conversation title auto-generated from first message
```

### **Flow 2: Continue Existing Conversation**
```
1. User taps conversation from list
2. Chat screen opens with history
3. User types new message
4. AI responds with context from previous messages
5. Conversation continues naturally
```

### **Flow 3: Get Quick Advice**
```
1. User opens Rizz Coach
2. Sees suggested prompts:
   - "Help me plan a date"
   - "Gift ideas for my partner"
   - "How to handle an argument"
   - "Relationship advice"
3. User taps prompt
4. AI responds immediately with personalized advice
```

---

## 💡 Suggested Prompts

### **Categories**

**Dating Advice:**
- "Help me plan a memorable first date"
- "How do I ask them out?"
- "What should I talk about on our date?"

**Relationship Help:**
- "We had an argument, what should I do?"
- "How can I be more romantic?"
- "I think they're losing interest"

**Gift Ideas:**
- "What gift should I get for their birthday?"
- "Anniversary gift ideas"
- "Just because gift suggestions"

**Communication:**
- "How do I express my feelings?"
- "They seem distant lately"
- "How to have a difficult conversation"

**Breakup Support:**
- "I think we need to break up"
- "They broke up with me"
- "How to move on"

---

## 📊 Analytics & Tracking

### **Metrics to Track**

1. **Usage Metrics:**
   - Total conversations
   - Messages per conversation
   - Active users
   - Conversation length
   - Return rate

2. **Topic Analysis:**
   - Most common topics
   - Sentiment analysis
   - Success indicators
   - User satisfaction

3. **Cost Tracking:**
   - Tokens per conversation
   - Cost per user
   - Model usage
   - Optimization opportunities

4. **Context Effectiveness:**
   - How often context is used
   - Context relevance scores
   - User feedback on advice quality

---

## 💰 Cost Estimation

### **Per Message:**
- System prompt: ~500 tokens
- Context: ~300 tokens
- History (10 msgs): ~1000 tokens
- User message: ~50 tokens
- **Input total: ~1850 tokens**

- AI response: ~300 tokens
- **Output total: ~300 tokens**

**Cost per message: ~$0.0004** (GPT-4o-mini)

### **Monthly Estimates:**
- 100 messages: $0.04
- 1,000 messages: $0.40
- 10,000 messages: $4.00

**Very affordable for high-quality coaching!**

---

## 🚀 Implementation Phases

### **Phase 1: Core Chat (Week 1)**
- [ ] Database schema
- [ ] Edge function for chat
- [ ] Basic chat UI
- [ ] Message sending/receiving
- [ ] Conversation list
- [ ] System prompt

### **Phase 2: Context Integration (Week 2)**
- [ ] Context gathering functions
- [ ] Date profile integration
- [ ] Conversation history
- [ ] Context-aware responses
- [ ] Testing with real data

### **Phase 3: UX Polish (Week 3)**
- [ ] Typing indicators
- [ ] Suggested prompts
- [ ] Conversation titles
- [ ] Search functionality
- [ ] Archive conversations
- [ ] Share advice

### **Phase 4: Advanced Features (Week 4)**
- [ ] Voice input
- [ ] Bookmark messages
- [ ] Export conversations
- [ ] Feedback system
- [ ] Analytics dashboard
- [ ] Cost optimization

---

## 🎨 Design Specifications

### **Colors:**
- **Primary:** Purple gradient (matches Rizz brand)
- **User messages:** Light purple background
- **AI messages:** White background
- **Accent:** Pink for highlights

### **Typography:**
- **User messages:** Regular weight
- **AI messages:** Slightly lighter weight
- **Timestamps:** Small, gray
- **Conversation titles:** Bold, 16px

### **Spacing:**
- **Message padding:** 12px
- **Message margin:** 8px
- **Input height:** 48px
- **Avatar size:** 36px

---

## 🔐 Privacy & Safety

### **Data Handling:**
- All conversations encrypted
- Context data anonymized in logs
- User can delete conversations
- No data shared with third parties
- GDPR compliant

### **Content Moderation:**
- Filter inappropriate requests
- Detect harmful advice
- Escalation for serious issues
- Crisis resources when needed

---

## 📝 Next Steps

### **Immediate Actions:**
1. ✅ Review and approve this plan
2. Create database migrations
3. Build Edge function
4. Design UI components
5. Implement chat interface
6. Test with sample data
7. Deploy to production

### **Questions to Answer:**
1. Should conversations be tied to specific date profiles?
2. How long should we keep conversation history?
3. Should users be able to share advice?
4. Do we need conversation folders/categories?
5. Should we offer voice input?

---

## 🎉 Expected Outcomes

### **User Benefits:**
- Personalized relationship advice 24/7
- Context-aware coaching
- Emotional support
- Practical actionable tips
- Improved relationship skills

### **Business Benefits:**
- Increased user engagement
- Higher retention rates
- Premium feature potential
- Valuable user insights
- Competitive differentiation

---

**Recommended Name: "Rizz Coach"** 🎯

**Tagline: "Your AI Relationship Coach - Always Here to Help"**

**Ready to build this amazing feature!** 🚀
