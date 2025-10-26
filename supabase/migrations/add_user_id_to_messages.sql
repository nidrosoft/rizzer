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
