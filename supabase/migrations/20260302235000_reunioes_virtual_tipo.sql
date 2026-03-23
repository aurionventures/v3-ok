-- Pauta Virtual: indica para qual tipo de órgão a reunião virtual é destinada (conselho, comite, comissao)
ALTER TABLE reunioes ADD COLUMN IF NOT EXISTS virtual_tipo text;
