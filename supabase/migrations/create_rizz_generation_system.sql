-- ============================================================================
-- Rizz AI Generation System - Database Migration
-- Creates tables and functions for AI-powered rizz line generation
-- ============================================================================

-- ============================================================================
-- 1. RIZZ GENERATION LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS rizz_generation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id bigint REFERENCES rizz_categories(id) ON DELETE CASCADE NOT NULL,
  batch_id uuid NOT NULL,
  lines_count integer NOT NULL DEFAULT 0,
  generation_duration_ms integer,
  model_used text DEFAULT 'gpt-4o-mini',
  prompt_tokens integer DEFAULT 0,
  completion_tokens integer DEFAULT 0,
  total_cost numeric(10, 6) DEFAULT 0,
  status text DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rizz_gen_log_user ON rizz_generation_log(user_id);
CREATE INDEX IF NOT EXISTS idx_rizz_gen_log_category ON rizz_generation_log(category_id);
CREATE INDEX IF NOT EXISTS idx_rizz_gen_log_created ON rizz_generation_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rizz_gen_log_batch ON rizz_generation_log(batch_id);

-- RLS Policies
ALTER TABLE rizz_generation_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own generation logs" ON rizz_generation_log;
CREATE POLICY "Users can view own generation logs"
  ON rizz_generation_log FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. HELPER FUNCTIONS
-- ============================================================================

-- Function to get generation statistics for a user
CREATE OR REPLACE FUNCTION get_rizz_generation_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_generations', COUNT(*),
    'total_lines', COALESCE(SUM(lines_count), 0),
    'total_cost', COALESCE(SUM(total_cost), 0),
    'success_rate', ROUND(
      (COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100), 2
    ),
    'avg_duration_ms', ROUND(AVG(generation_duration_ms)),
    'last_generation', MAX(created_at)
  )
  INTO result
  FROM rizz_generation_log
  WHERE user_id = p_user_id;
  
  RETURN result;
END;
$$;

-- Function to get category generation history
CREATE OR REPLACE FUNCTION get_category_generation_history(
  p_category_id bigint,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  batch_id uuid,
  lines_count integer,
  duration_ms integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rgl.batch_id,
    rgl.lines_count,
    rgl.generation_duration_ms,
    rgl.created_at
  FROM rizz_generation_log rgl
  WHERE rgl.category_id = p_category_id
    AND rgl.status = 'success'
    AND rgl.user_id = auth.uid()
  ORDER BY rgl.created_at DESC
  LIMIT p_limit;
END;
$$;

-- ============================================================================
-- 3. UPDATE RIZZ_CATEGORIES TABLE
-- ============================================================================

-- Add last_generated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rizz_categories' 
    AND column_name = 'last_generated_at'
  ) THEN
    ALTER TABLE rizz_categories 
    ADD COLUMN last_generated_at timestamp with time zone;
  END IF;
END $$;

-- ============================================================================
-- 4. UPDATE RIZZ_MESSAGES TABLE
-- ============================================================================

-- Ensure all required columns exist
DO $$ 
BEGIN
  -- Add generation_batch_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rizz_messages' 
    AND column_name = 'generation_batch_id'
  ) THEN
    ALTER TABLE rizz_messages 
    ADD COLUMN generation_batch_id uuid;
  END IF;

  -- Add confidence_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rizz_messages' 
    AND column_name = 'confidence_score'
  ) THEN
    ALTER TABLE rizz_messages 
    ADD COLUMN confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100);
  END IF;

  -- Add tags if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rizz_messages' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE rizz_messages 
    ADD COLUMN tags text[];
  END IF;

  -- Add tone if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rizz_messages' 
    AND column_name = 'tone'
  ) THEN
    ALTER TABLE rizz_messages 
    ADD COLUMN tone text;
  END IF;
END $$;

-- Add index for batch queries
CREATE INDEX IF NOT EXISTS idx_rizz_messages_batch ON rizz_messages(generation_batch_id);

-- ============================================================================
-- 5. TRIGGER TO UPDATE CATEGORY STATS
-- ============================================================================

-- Function to update category stats after generation
CREATE OR REPLACE FUNCTION update_category_after_generation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update rizz_count and last_generated_at
  UPDATE rizz_categories
  SET 
    rizz_count = rizz_count + NEW.lines_count,
    last_generated_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.category_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_category_after_generation ON rizz_generation_log;
CREATE TRIGGER trigger_update_category_after_generation
  AFTER INSERT ON rizz_generation_log
  FOR EACH ROW
  WHEN (NEW.status = 'success')
  EXECUTE FUNCTION update_category_after_generation();

-- ============================================================================
-- 6. GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT SELECT ON rizz_generation_log TO authenticated;
GRANT EXECUTE ON FUNCTION get_rizz_generation_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_generation_history(bigint, integer) TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify tables exist
DO $$
BEGIN
  RAISE NOTICE 'Rizz AI Generation System migration completed successfully!';
  RAISE NOTICE 'Tables created: rizz_generation_log';
  RAISE NOTICE 'Functions created: get_rizz_generation_stats, get_category_generation_history';
  RAISE NOTICE 'Triggers created: trigger_update_category_after_generation';
END $$;
