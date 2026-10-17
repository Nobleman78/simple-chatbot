CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('child', 'bot')),
  message TEXT NOT NULL,
  detected_mode TEXT,
  mood TEXT CHECK (mood IN ('happy', 'excited', 'okay', 'tired', 'sad')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_child_session_created_at_idx
  ON public.conversations (child_id, session_id, created_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
