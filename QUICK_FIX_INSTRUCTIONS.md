# 🚨 QUICK FIX - Do These 2 Things

## Issue 1: Database Schema Missing Column ❌

**Error:** "Could not find the 'user_id' column"

### Fix:
1. Go to **Supabase Dashboard** (supabase.com)
2. Open your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. **Copy and paste this:**

```sql
ALTER TABLE rizz_conversation_messages 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE rizz_conversation_messages m
SET user_id = c.user_id
FROM rizz_conversations c
WHERE m.conversation_id = c.id;

ALTER TABLE rizz_conversation_messages 
ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Users can view their own messages" ON rizz_conversation_messages;
DROP POLICY IF EXISTS "Users can create their own messages" ON rizz_conversation_messages;

CREATE POLICY "Users can view their own messages"
ON rizz_conversation_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages"
ON rizz_conversation_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

6. Click **Run** (or press Cmd+Enter)
7. Wait for "Success" message

---

## Issue 2: Module Cache Error ❌

**Error:** "Requiring unknown module 3106"

### Fix:
In your terminal:

```bash
# Stop the dev server (Ctrl+C)
# Then run:
npm start -- --reset-cache
```

Or in the app:
- Shake device
- Tap "Reload"

---

## That's It! ✅

After doing both:
1. ✅ Database has user_id column
2. ✅ App cache is cleared
3. ✅ Everything works!

**Test by:**
- Creating new conversation
- Sending "hey"
- Getting short greeting response
- No errors!

🚀 **Ready to go!**
