-- Permite membro marcar progresso do briefing (confirmou leitura, abriu anexos)
-- Estado persiste por briefing; novos briefings começam com checkboxes desmarcados
ALTER TABLE membro_briefing
  ADD COLUMN IF NOT EXISTS confirmou_leitura boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS abriu_anexos boolean DEFAULT false;

-- Membro pode atualizar apenas seus próprios briefings (para marcar progresso)
DROP POLICY IF EXISTS membro_briefing_update_own ON membro_briefing;
CREATE POLICY membro_briefing_update_own ON membro_briefing
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM membros_governanca m
      WHERE m.id = membro_briefing.membro_id AND m.user_id = auth.uid()
    )
  );
