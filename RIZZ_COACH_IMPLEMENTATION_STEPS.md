# 🚀 Rizz Coach - Implementation Steps

## ✅ What You Already Have:

### **Database Tables (100% Complete):**
1. ✅ `rizz_conversations` - Chat threads
2. ✅ `rizz_conversation_messages` - Chat messages
3. ✅ All columns needed for basic chat

### **Backend Code (90% Complete):**
1. ✅ `/lib/geniusChat.ts` - Full CRUD operations (456 lines)
2. ✅ Get/create/update/delete threads
3. ✅ Get/create messages
4. ✅ Auto-generate titles
5. ✅ Statistics functions
6. ⚠️ AI integration is placeholder only

---

## 🎯 Implementation Plan

### **Step 1: Enhance Database Schema** ⏱️ 15 minutes

Add context fields to support relationship coaching:

```sql
-- Add date_profile_id for context
ALTER TABLE rizz_conversations 
ADD COLUMN date_profile_id UUID REFERENCES date_profiles(id) ON DELETE SET NULL;

-- Add context summary
ALTER TABLE rizz_conversations 
ADD COLUMN context_summary TEXT;

-- Add indexes
CREATE INDEX idx_rizz_conversations_date_profile 
ON rizz_conversations(date_profile_id);

-- Add context_used to messages (track what context was used)
ALTER TABLE rizz_conversation_messages 
ADD COLUMN context_used JSONB;

-- Add cost tracking
ALTER TABLE rizz_conversation_messages 
ADD COLUMN cost NUMERIC(10, 6);
```

---

### **Step 2: Set Up RLS Policies** ⏱️ 10 minutes

```sql
-- Enable RLS
ALTER TABLE rizz_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_conversation_messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view own conversations"
  ON rizz_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON rizz_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON rizz_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON rizz_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in own conversations"
  ON rizz_conversation_messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM rizz_conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert messages"
  ON rizz_conversation_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can insert own messages"
  ON rizz_conversation_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM rizz_conversations WHERE user_id = auth.uid()
    )
  );
```

---

### **Step 3: Create Edge Function** ⏱️ 30 minutes

Create `/supabase/functions/rizz-coach-chat/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYSTEM_PROMPT = `You are Rizz Coach, an empathetic AI relationship coach...`;

serve(async (req) => {
  const { conversationId, userMessage, dateProfileId } = await req.json();
  
  // 1. Gather context
  const context = await gatherContext(supabase, userId, dateProfileId);
  
  // 2. Get conversation history
  const history = await getHistory(supabase, conversationId);
  
  // 3. Build messages
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + buildContext(context) },
    ...history,
    { role: 'user', content: userMessage }
  ];
  
  // 4. Call OpenAI
  const aiResponse = await callOpenAI(messages);
  
  // 5. Save messages
  await saveMessages(supabase, conversationId, userMessage, aiResponse);
  
  return new Response(JSON.stringify({ success: true, response: aiResponse }));
});
```

---

### **Step 4: Update geniusChat.ts** ⏱️ 15 minutes

Replace placeholder AI with actual Edge Function call:

```typescript
// In sendMessage function, replace placeholder with:
const { data, error } = await supabase.functions.invoke('rizz-coach-chat', {
  body: {
    conversationId: threadId,
    userMessage: userMessage,
    dateProfileId: dateProfileId, // Optional
  },
});
```

---

### **Step 5: Build Frontend - Conversation List** ⏱️ 45 minutes

Create `/app/rizz-coach/index.tsx`:

```typescript
export default function RizzCoachScreen() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadThreads();
  }, []);
  
  const loadThreads = async () => {
    const result = await getChatThreads(user.id);
    if (result.success) {
      setThreads(result.data || []);
    }
    setLoading(false);
  };
  
  return (
    <View>
      <Header title="Rizz Coach" />
      <ConversationList 
        threads={threads}
        onThreadPress={handleThreadPress}
      />
      <FAB onPress={handleNewConversation} />
    </View>
  );
}
```

---

### **Step 6: Build Frontend - Chat Screen** ⏱️ 60 minutes

Create `/app/rizz-coach/chat.tsx`:

```typescript
export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    setSending(true);
    const result = await sendMessage(id, user.id, inputText);
    
    if (result.success) {
      setMessages([...messages, result.data.userMessage, result.data.aiMessage]);
      setInputText('');
    }
    
    setSending(false);
  };
  
  return (
    <View>
      <Header title={thread.title} />
      <MessageList messages={messages} />
      <ChatInput 
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        sending={sending}
      />
    </View>
  );
}
```

---

### **Step 7: Create UI Components** ⏱️ 90 minutes

1. **ConversationList.tsx** - List of chat threads
2. **ConversationCard.tsx** - Individual thread card
3. **MessageList.tsx** - Scrollable message list
4. **MessageBubble.tsx** - User/AI message bubble
5. **ChatInput.tsx** - Message input with send button
6. **TypingIndicator.tsx** - "Rizz Coach is typing..."
7. **ContextSelector.tsx** - Select date profile for context
8. **SuggestedPrompts.tsx** - Quick start prompts

---

## 📊 Time Estimate

| Phase | Task | Time |
|-------|------|------|
| 1 | Database enhancements | 15 min |
| 2 | RLS policies | 10 min |
| 3 | Edge Function | 30 min |
| 4 | Update geniusChat.ts | 15 min |
| 5 | Conversation list screen | 45 min |
| 6 | Chat screen | 60 min |
| 7 | UI components | 90 min |
| **Total** | | **~4.5 hours** |

---

## 🎯 Priority Order

### **Must Have (MVP):**
1. ✅ Database schema enhancements
2. ✅ RLS policies
3. ✅ Edge Function with AI
4. ✅ Basic conversation list
5. ✅ Basic chat interface
6. ✅ Message sending/receiving

### **Should Have (V1.1):**
1. Context integration (date profiles)
2. Suggested prompts
3. Typing indicators
4. Thread titles auto-generation
5. Archive functionality

### **Nice to Have (V1.2):**
1. Search conversations
2. Export chat history
3. Bookmark messages
4. Voice input
5. Image sharing

---

## 🚀 Let's Start!

**Recommended Approach:**
1. Start with database (Step 1 & 2) - 25 minutes
2. Build Edge Function (Step 3) - 30 minutes
3. Update backend (Step 4) - 15 minutes
4. Build UI (Steps 5-7) - 3 hours

**Total: ~4.5 hours for full MVP**

---

## 💡 Key Decisions Needed:

1. **Should conversations be tied to date profiles?**
   - ✅ YES - Allows context-aware coaching
   - Makes advice more personalized

2. **How many messages to keep in context?**
   - Recommend: Last 10 messages
   - Balances context vs. cost

3. **Should we show suggested prompts?**
   - ✅ YES - Helps users get started
   - Reduces friction

4. **Auto-generate thread titles?**
   - ✅ YES - From first message
   - Better UX than "New Conversation"

---

## 📝 Next Action:

**Ready to proceed with Step 1: Database Enhancements?**

I can create the migration file and apply it right now!

Just say "yes" and I'll start implementing! 🚀
