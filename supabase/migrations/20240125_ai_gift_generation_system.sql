-- AI Gift Generation System - Additional Tables
-- This migration adds tables for AI generation scheduling and API key management

-- ============================================================================
-- 1. AI Gift Generation Schedule Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_gift_generation_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(date_profile_id)
);

-- Indexes for performance
CREATE INDEX idx_generation_schedule_profile ON ai_gift_generation_schedule(date_profile_id);
CREATE INDEX idx_generation_schedule_user ON ai_gift_generation_schedule(user_id);
CREATE INDEX idx_generation_schedule_next ON ai_gift_generation_schedule(next_scheduled_at) WHERE enabled = TRUE;
CREATE INDEX idx_generation_schedule_enabled ON ai_gift_generation_schedule(enabled);

-- RLS Policies
ALTER TABLE ai_gift_generation_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation schedule"
  ON ai_gift_generation_schedule FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own generation schedule"
  ON ai_gift_generation_schedule FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert generation schedules"
  ON ai_gift_generation_schedule FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 2. Enhance AI Gift Generation Log Table
-- ============================================================================
ALTER TABLE ai_gift_generation_log 
  ADD COLUMN IF NOT EXISTS profile_data_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS ai_response_raw TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS error_details TEXT;

-- Add index for error tracking
CREATE INDEX IF NOT EXISTS idx_generation_log_status ON ai_gift_generation_log(status);
CREATE INDEX IF NOT EXISTS idx_generation_log_date ON ai_gift_generation_log(created_at DESC);

-- ============================================================================
-- 3. Helper Functions
-- ============================================================================

-- Function to get profiles that need generation
CREATE OR REPLACE FUNCTION get_profiles_needing_generation()
RETURNS TABLE (
  profile_id UUID,
  user_id UUID,
  last_generated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.date_profile_id,
    s.user_id,
    s.last_generated_at
  FROM ai_gift_generation_schedule s
  WHERE s.enabled = TRUE
    AND (
      s.next_scheduled_at IS NULL 
      OR s.next_scheduled_at <= NOW()
    )
  ORDER BY s.last_generated_at ASC NULLS FIRST
  LIMIT 100; -- Process 100 profiles at a time
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update schedule after generation
CREATE OR REPLACE FUNCTION update_generation_schedule(
  p_profile_id UUID,
  p_success BOOLEAN,
  p_next_run_hours INTEGER DEFAULT 5
)
RETURNS VOID AS $$
BEGIN
  UPDATE ai_gift_generation_schedule
  SET 
    last_generated_at = NOW(),
    next_scheduled_at = NOW() + (p_next_run_hours || ' hours')::INTERVAL,
    total_generations = total_generations + 1,
    successful_generations = CASE WHEN p_success THEN successful_generations + 1 ELSE successful_generations END,
    failed_generations = CASE WHEN NOT p_success THEN failed_generations + 1 ELSE failed_generations END,
    updated_at = NOW()
  WHERE date_profile_id = p_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize schedule for new profile
CREATE OR REPLACE FUNCTION initialize_gift_generation_schedule()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ai_gift_generation_schedule (date_profile_id, user_id, next_scheduled_at)
  VALUES (NEW.id, NEW.user_id, NOW())
  ON CONFLICT (date_profile_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create schedule when profile is created
DROP TRIGGER IF EXISTS trigger_initialize_gift_schedule ON date_profiles;
CREATE TRIGGER trigger_initialize_gift_schedule
  AFTER INSERT ON date_profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_gift_generation_schedule();

-- ============================================================================
-- 4. Analytics Views
-- ============================================================================

-- View for generation statistics
CREATE OR REPLACE VIEW ai_gift_generation_stats AS
SELECT 
  DATE(created_at) as generation_date,
  COUNT(*) as total_generations,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_generations,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_generations,
  AVG(generation_duration_ms) as avg_duration_ms,
  SUM(prompt_tokens) as total_prompt_tokens,
  SUM(completion_tokens) as total_completion_tokens,
  SUM(total_cost) as total_cost_usd,
  AVG(suggestions_count) as avg_suggestions_per_generation
FROM ai_gift_generation_log
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY generation_date DESC;

-- View for user engagement with AI suggestions
CREATE OR REPLACE VIEW ai_gift_suggestion_engagement AS
SELECT 
  DATE(created_at) as suggestion_date,
  COUNT(*) as total_suggestions,
  SUM(CASE WHEN status = 'saved' THEN 1 ELSE 0 END) as saved_count,
  SUM(CASE WHEN status = 'dismissed' THEN 1 ELSE 0 END) as dismissed_count,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
  AVG(confidence_score) as avg_confidence_score,
  COUNT(DISTINCT date_profile_id) as unique_profiles
FROM date_profile_ai_gift_suggestions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY suggestion_date DESC;

-- ============================================================================
-- 5. Backfill existing profiles
-- ============================================================================

-- Initialize schedule for all existing profiles
INSERT INTO ai_gift_generation_schedule (date_profile_id, user_id, next_scheduled_at)
SELECT id, user_id, NOW()
FROM date_profiles
ON CONFLICT (date_profile_id) DO NOTHING;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE ai_gift_generation_schedule IS 'Tracks AI gift generation schedule for each date profile';
COMMENT ON COLUMN ai_gift_generation_schedule.frequency IS 'Generation frequency: daily_5x (5 times/day), daily_3x (3 times/day), daily_1x (once/day), disabled';
COMMENT ON FUNCTION get_profiles_needing_generation() IS 'Returns list of profiles that need AI gift generation';
COMMENT ON FUNCTION update_generation_schedule(UUID, BOOLEAN, INTEGER) IS 'Updates schedule after generation attempt';
COMMENT ON VIEW ai_gift_generation_stats IS 'Daily statistics for AI gift generation';
COMMENT ON VIEW ai_gift_suggestion_engagement IS 'User engagement metrics for AI suggestions';
