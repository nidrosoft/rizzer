# 🔧 Database Migration Required

## Critical Issue:

The `rizz_conversation_messages` table is missing the `user_id` column needed for RLS (Row Level Security).

---

## Error You're Seeing:

```
Error: Could not find the 'user_id' column of 'rizz_conversation_messages' in the schema cache
```

---

## Solution: Run This SQL Migration

**Go to your Supabase Dashboard → SQL Editor → New Query**

Paste and run this SQL:

```sql
-- Add user_id column to rizz_conversation_messages table
ALTER TABLE rizz_conversation_messages 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing rows to set user_id from the conversation
UPDATE rizz_conversation_messages m
SET user_id = c.user_id
FROM rizz_conversations c
WHERE m.conversation_id = c.id
AND m.user_id IS NULL;

-- Make user_id NOT NULL after updating existing rows
ALTER TABLE rizz_conversation_messages 
ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policies for rizz_conversation_messages
DROP POLICY IF EXISTS "Users can view their own messages" ON rizz_conversation_messages;
DROP POLICY IF EXISTS "Users can create their own messages" ON rizz_conversation_messages;

-- Create new RLS policies using user_id
CREATE POLICY "Users can view their own messages"
ON rizz_conversation_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages"
ON rizz_conversation_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## What This Does:

1. **Adds `user_id` column** to messages table
2. **Populates existing messages** with user_id from their conversations
3. **Makes `user_id` required** (NOT NULL)
4. **Updates RLS policies** to use user_id directly

---

## After Running Migration:

✅ No more "user_id column not found" errors  
✅ Messages will save properly  
✅ RLS policies will work correctly  
✅ Chat will function normally  

---

## Alternative: Supabase CLI

If you have Supabase CLI linked:

```bash
cd /Users/blackpanther/Desktop/Rizzers
supabase db push
```

But the easiest way is through the **Supabase Dashboard SQL Editor**.

---

## About the Markdown Error:

The `react-native-markdown-display` package is already installed. The error should go away after:

1. **Stop the dev server** (Ctrl+C)
2. **Clear cache:** `npm start -- --reset-cache`
3. **Restart app**

Or just reload the app (shake device → Reload).

---

## Summary:

**Two fixes needed:**

1. ✅ **Run SQL migration** in Supabase Dashboard
2. ✅ **Reload app** to clear module cache

**Then everything will work!** 🚀
