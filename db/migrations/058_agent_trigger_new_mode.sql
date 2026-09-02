-- 058_agent_trigger_new_mode.sql
-- Adds 'new' ("New conversations only") to the agents.trigger_mode CHECK that
-- migration 053 created as ('any','keyword'). The agent router, agentService
-- and the admin UI all support 'new'; without this, saving that mode through
-- the agentService path fails with a 23514 check violation. Idempotent: the
-- constraint is only dropped/recreated when it exists without 'new'.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'agents_trigger_mode_check'
       AND pg_get_constraintdef(oid) NOT LIKE '%''new''%'
  ) THEN
    ALTER TABLE coexistence.agents
      DROP CONSTRAINT agents_trigger_mode_check;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agents_trigger_mode_check') THEN
    ALTER TABLE coexistence.agents
      ADD CONSTRAINT agents_trigger_mode_check CHECK (trigger_mode IN ('any', 'keyword', 'new'));
  END IF;
END $$;
