-- ============================================================================
-- Gifts & Ideas Complete Database Schema
-- ============================================================================
-- This migration creates all tables for the AI-powered gift suggestion system
-- including AI suggestions, user ideas, gift history, and generation logs
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table 1: AI Gift Suggestions
-- ============================================================================
-- Stores AI-generated gift suggestions with 24-hour expiration
-- Users cannot delete these, only dismiss or save them
-- ============================================================================

CREATE TABLE IF NOT EXISTS date_profile_ai_gift_suggestions (
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
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generation_batch_id UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- User Actions
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'saved', 'dismissed', 'expired')),
  saved_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  
  -- Notifications
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  notification_opened BOOLEAN DEFAULT FALSE,
  notification_opened_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for AI Gift Suggestions
CREATE INDEX idx_ai_gifts_profile ON date_profile_ai_gift_suggestions(date_profile_id);
CREATE INDEX idx_ai_gifts_status ON date_profile_ai_gift_suggestions(status);
CREATE INDEX idx_ai_gifts_expires ON date_profile_ai_gift_suggestions(expires_at);
CREATE INDEX idx_ai_gifts_batch ON date_profile_ai_gift_suggestions(generation_batch_id);
CREATE INDEX idx_ai_gifts_notification ON date_profile_ai_gift_suggestions(notification_sent, notification_sent_at);
CREATE INDEX idx_ai_gifts_created ON date_profile_ai_gift_suggestions(created_at DESC);

-- RLS Policies for AI Gift Suggestions
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

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_gift_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_gift_suggestions_timestamp
  BEFORE UPDATE ON date_profile_ai_gift_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_gift_suggestions_updated_at();

-- ============================================================================
-- Table 2: User Gift Ideas
-- ============================================================================
-- Stores user-manually-added gift ideas
-- Users can fully manage (create, update, delete) these
-- ============================================================================

CREATE TABLE IF NOT EXISTS date_profile_gift_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Gift Details
  title TEXT NOT NULL,
  occasion TEXT,
  budget TEXT,
  notes TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  
  -- Status
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'purchased', 'given')),
  
  -- Dates
  target_date DATE,
  purchased_date DATE,
  given_date DATE,
  
  -- Source tracking (manual vs from AI suggestion)
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai_suggestion')),
  ai_suggestion_id UUID REFERENCES date_profile_ai_gift_suggestions(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Gift Ideas
CREATE INDEX idx_gift_ideas_profile ON date_profile_gift_ideas(date_profile_id);
CREATE INDEX idx_gift_ideas_status ON date_profile_gift_ideas(status);
CREATE INDEX idx_gift_ideas_priority ON date_profile_gift_ideas(priority);
CREATE INDEX idx_gift_ideas_target_date ON date_profile_gift_ideas(target_date);
CREATE INDEX idx_gift_ideas_created ON date_profile_gift_ideas(created_at DESC);

-- RLS Policies for Gift Ideas
ALTER TABLE date_profile_gift_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own gift ideas"
  ON date_profile_gift_ideas FOR ALL
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gift_ideas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gift_ideas_timestamp
  BEFORE UPDATE ON date_profile_gift_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_ideas_updated_at();

-- ============================================================================
-- Table 3: Gift History
-- ============================================================================
-- Stores history of gifts that have been given
-- Users can manage (create, update, delete) these
-- ============================================================================

CREATE TABLE IF NOT EXISTS date_profile_gift_history (
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
  
  -- Photos (array of URLs)
  photos TEXT[],
  
  -- Source tracking
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai_suggestion', 'gift_idea')),
  ai_suggestion_id UUID REFERENCES date_profile_ai_gift_suggestions(id) ON DELETE SET NULL,
  gift_idea_id UUID REFERENCES date_profile_gift_ideas(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Gift History
CREATE INDEX idx_gift_history_profile ON date_profile_gift_history(date_profile_id);
CREATE INDEX idx_gift_history_date_given ON date_profile_gift_history(date_given DESC);
CREATE INDEX idx_gift_history_source ON date_profile_gift_history(source);
CREATE INDEX idx_gift_history_created ON date_profile_gift_history(created_at DESC);

-- RLS Policies for Gift History
ALTER TABLE date_profile_gift_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own gift history"
  ON date_profile_gift_history FOR ALL
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gift_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gift_history_timestamp
  BEFORE UPDATE ON date_profile_gift_history
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_history_updated_at();

-- ============================================================================
-- Table 4: AI Gift Generation Log
-- ============================================================================
-- Tracks AI generation runs for monitoring and debugging
-- Read-only for users, written by backend
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_gift_generation_log (
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
  total_cost DECIMAL(10, 6),
  
  -- Status
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  error_message TEXT,
  
  -- Metadata
  profile_data_snapshot JSONB, -- Snapshot of profile data used for generation
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Generation Log
CREATE INDEX idx_generation_log_profile ON ai_gift_generation_log(date_profile_id);
CREATE INDEX idx_generation_log_batch ON ai_gift_generation_log(batch_id);
CREATE INDEX idx_generation_log_created ON ai_gift_generation_log(created_at DESC);
CREATE INDEX idx_generation_log_status ON ai_gift_generation_log(status);

-- RLS Policies for Generation Log
ALTER TABLE ai_gift_generation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation logs"
  ON ai_gift_generation_log FOR SELECT
  USING (
    date_profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to automatically expire old AI suggestions
CREATE OR REPLACE FUNCTION expire_old_ai_suggestions()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE date_profile_ai_gift_suggestions
  SET status = 'expired',
      updated_at = NOW()
  WHERE status = 'pending'
    AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get active AI suggestions for a profile
CREATE OR REPLACE FUNCTION get_active_ai_suggestions(profile_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  reason TEXT,
  price TEXT,
  occasion TEXT,
  confidence_score INTEGER,
  product_link TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.reason,
    s.price,
    s.occasion,
    s.confidence_score,
    s.product_link,
    s.generated_at,
    s.expires_at
  FROM date_profile_ai_gift_suggestions s
  WHERE s.date_profile_id = profile_id
    AND s.status = 'pending'
    AND s.expires_at > NOW()
  ORDER BY s.confidence_score DESC, s.created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get gift statistics for a profile
CREATE OR REPLACE FUNCTION get_gift_statistics(profile_id UUID)
RETURNS TABLE (
  total_ideas INTEGER,
  total_history INTEGER,
  active_ai_suggestions INTEGER,
  gifts_given_this_month INTEGER,
  total_spent TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM date_profile_gift_ideas WHERE date_profile_id = profile_id),
    (SELECT COUNT(*)::INTEGER FROM date_profile_gift_history WHERE date_profile_id = profile_id),
    (SELECT COUNT(*)::INTEGER FROM date_profile_ai_gift_suggestions 
     WHERE date_profile_id = profile_id AND status = 'pending' AND expires_at > NOW()),
    (SELECT COUNT(*)::INTEGER FROM date_profile_gift_history 
     WHERE date_profile_id = profile_id 
     AND date_given >= DATE_TRUNC('month', CURRENT_DATE)),
    (SELECT STRING_AGG(price, ', ') FROM date_profile_gift_history 
     WHERE date_profile_id = profile_id AND price IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE date_profile_ai_gift_suggestions IS 'AI-generated gift suggestions with 24-hour expiration. Users can view, save, or dismiss but not delete.';
COMMENT ON TABLE date_profile_gift_ideas IS 'User-manually-added gift ideas. Users have full CRUD control.';
COMMENT ON TABLE date_profile_gift_history IS 'History of gifts that have been given. Users have full CRUD control.';
COMMENT ON TABLE ai_gift_generation_log IS 'Log of AI generation runs for monitoring and debugging.';

COMMENT ON COLUMN date_profile_ai_gift_suggestions.generation_batch_id IS 'Groups suggestions from the same daily generation run';
COMMENT ON COLUMN date_profile_ai_gift_suggestions.expires_at IS 'Suggestions expire 24 hours after generation';
COMMENT ON COLUMN date_profile_ai_gift_suggestions.confidence_score IS 'AI confidence score (0-100) indicating match quality';
COMMENT ON COLUMN date_profile_gift_ideas.source IS 'Tracks if idea was manually added or saved from AI suggestion';
COMMENT ON COLUMN date_profile_gift_history.source IS 'Tracks origin: manual entry, AI suggestion, or converted gift idea';

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Uncomment below to insert sample data for testing

/*
-- Sample AI Suggestion
INSERT INTO date_profile_ai_gift_suggestions (
  date_profile_id,
  title,
  reason,
  price,
  occasion,
  confidence_score,
  product_link,
  generation_batch_id,
  expires_at
) VALUES (
  (SELECT id FROM date_profiles LIMIT 1),
  'Professional Hair Styling Kit',
  'Based on her profession as a hair braider',
  '$89.99',
  'Birthday',
  95,
  'https://example.com/product',
  uuid_generate_v4(),
  NOW() + INTERVAL '24 hours'
);

-- Sample Gift Idea
INSERT INTO date_profile_gift_ideas (
  date_profile_id,
  title,
  occasion,
  budget,
  notes,
  priority
) VALUES (
  (SELECT id FROM date_profiles LIMIT 1),
  'Weekend Trip to Napa Valley',
  'Anniversary',
  '$500-800',
  'She mentioned wanting to visit wine country',
  'High'
);

-- Sample Gift History
INSERT INTO date_profile_gift_history (
  date_profile_id,
  title,
  occasion,
  price,
  date_given,
  reaction,
  reaction_emoji
) VALUES (
  (SELECT id FROM date_profiles LIMIT 1),
  'Lavender Scented Candles',
  'Just Because',
  '$24.99',
  CURRENT_DATE - INTERVAL '10 days',
  'Loved it!',
  '❤️'
);
*/

-- ============================================================================
-- End of Migration
-- ============================================================================
