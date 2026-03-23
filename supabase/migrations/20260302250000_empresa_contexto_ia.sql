-- Dados da empresa para contexto de IA (pautas sugeridas, insights, etc.)
ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS setor text,
  ADD COLUMN IF NOT EXISTS segmento text,
  ADD COLUMN IF NOT EXISTS porte text,
  ADD COLUMN IF NOT EXISTS areas_atuacao text,
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS missao text;

COMMENT ON COLUMN empresas.setor IS 'Setor econômico principal (ex: Indústria, Tecnologia, Saúde)';
COMMENT ON COLUMN empresas.segmento IS 'Segmento ou nicho de atuação';
COMMENT ON COLUMN empresas.porte IS 'Porte da empresa: micro, pequena, media, grande';
COMMENT ON COLUMN empresas.areas_atuacao IS 'Principais áreas de atuação da empresa';
COMMENT ON COLUMN empresas.descricao IS 'Descrição da empresa para contexto de IA';
COMMENT ON COLUMN empresas.missao IS 'Missão ou visão da empresa';
