-- 059_agent_handoff_and_close_summary.sql
--
-- Adds the database state used by the AI-agent CRM tools, human handoff, and
-- idle close-summary features. The application code already reads these
-- columns while routing every inbound message, so deployments missing them
-- fail before an agent run can be queued.
--
-- Idempotent: safe for databases where some or all columns were added
-- manually before this migration existed.

ALTER TABLE coexistence.agents
  ADD COLUMN IF NOT EXISTS crm_tools_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS handoff_enabled        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS handoff_user_ids       JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS handoff_keywords       TEXT,
  ADD COLUMN IF NOT EXISTS handoff_rr_pointer     INTEGER NOT NULL DEFAULT -1,
  ADD COLUMN IF NOT EXISTS close_summary_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS close_idle_minutes     INTEGER NOT NULL DEFAULT 30;

ALTER TABLE coexistence.contacts
  ADD COLUMN IF NOT EXISTS agent_paused         BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS agent_paused_by      TEXT,
  ADD COLUMN IF NOT EXISTS agent_paused_reason  TEXT,
  ADD COLUMN IF NOT EXISTS agent_paused_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS agent_close_pending  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS agent_last_run_at    TIMESTAMPTZ;

-- Supports the periodic close-summary sweep without scanning every contact.
CREATE INDEX IF NOT EXISTS idx_contacts_agent_close_pending
  ON coexistence.contacts (agent_last_run_at)
  WHERE agent_close_pending = TRUE;

-- PG15 has no ADD CONSTRAINT IF NOT EXISTS, so guard the idle-window check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'agents_close_idle_minutes_check'
       AND conrelid = 'coexistence.agents'::regclass
  ) THEN
    ALTER TABLE coexistence.agents
      ADD CONSTRAINT agents_close_idle_minutes_check
      CHECK (close_idle_minutes BETWEEN 1 AND 1440);
  END IF;
END $$;
