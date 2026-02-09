-- ============================================================
-- ReadBuddy Supabase Schema Migration
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  font_size integer DEFAULT 24,
  letter_spacing integer DEFAULT 3,
  word_spacing integer DEFAULT 4,
  line_height integer DEFAULT 22,
  reading_speed integer DEFAULT 8,
  background_color text DEFAULT '#FFF8E7',
  reading_ruler boolean DEFAULT false,
  syllable_helper boolean DEFAULT true,
  api_key_encrypted text,
  api_provider text DEFAULT 'openai',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own settings but NOT the encrypted API key
-- (API key is only accessed server-side via Edge Function)
CREATE POLICY "Users can read own settings"
  ON user_settings FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 3. USER PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  total_xp_earned integer DEFAULT 0,
  streak_current integer DEFAULT 0,
  streak_best integer DEFAULT 0,
  streak_last_date text,
  streak_history jsonb DEFAULT '[]'::jsonb,
  stories_read jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 4. GENERATED STORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  story_key text NOT NULL,
  topic text NOT NULL,
  level integer NOT NULL,
  title text NOT NULL,
  icon text,
  content jsonb NOT NULL,
  words jsonb,
  quiz jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, story_key)
);

ALTER TABLE generated_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stories"
  ON generated_stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stories"
  ON generated_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories"
  ON generated_stories FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 5. TOPIC PREFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS topic_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id text NOT NULL,
  topic_name text NOT NULL,
  topic_icon text,
  topic_color text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE topic_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own topics"
  ON topic_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own topics"
  ON topic_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own topics"
  ON topic_preferences FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. RPC: Store API Key (encrypts server-side)
-- Called from browser: supabase.rpc('store_api_key', { p_key: '...', p_provider: '...' })
-- ============================================================
CREATE OR REPLACE FUNCTION store_api_key(p_key text, p_provider text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_settings (id, api_key_encrypted, api_provider, updated_at)
  VALUES (
    auth.uid(),
    pgp_sym_encrypt(p_key, 'readbuddy-enc-2026-change-me'),
    p_provider,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    api_key_encrypted = pgp_sym_encrypt(p_key, 'readbuddy-enc-2026-change-me'),
    api_provider = p_provider,
    updated_at = now();
END;
$$;

-- ============================================================
-- 7. RPC: Decrypt API Key (only callable from service role / Edge Functions)
-- ============================================================
CREATE OR REPLACE FUNCTION decrypt_api_key(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key text;
BEGIN
  SELECT pgp_sym_decrypt(
    api_key_encrypted::bytea,
    'readbuddy-enc-2026-change-me'
  ) INTO v_key
  FROM user_settings
  WHERE id = p_user_id AND api_key_encrypted IS NOT NULL;

  RETURN v_key;
END;
$$;

-- Revoke direct access — only Edge Functions (service role) can call this
REVOKE EXECUTE ON FUNCTION decrypt_api_key(uuid) FROM anon, authenticated;

-- ============================================================
-- 8. RPC: Check if user has an API key (safe for browser)
-- ============================================================
CREATE OR REPLACE FUNCTION has_api_key()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has boolean;
BEGIN
  SELECT (api_key_encrypted IS NOT NULL) INTO v_has
  FROM user_settings
  WHERE id = auth.uid();

  RETURN COALESCE(v_has, false);
END;
$$;

-- ============================================================
-- 9. Auto-create profile + settings + progress on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO user_settings (id) VALUES (NEW.id);
  INSERT INTO user_progress (id) VALUES (NEW.id);

  RETURN NEW;
END;
$$;

-- Trigger on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Encryption key is hardcoded in store_api_key() and decrypt_api_key() above.
-- To change it, update the key string in both functions.
