-- Migration: Adicionar campo partner_type em partner_invitations
-- Data: 2026-01-20
-- Descrição: Adiciona campo para armazenar o tipo de parceiro selecionado no cadastro

-- Adicionar coluna partner_type
ALTER TABLE public.partner_invitations 
ADD COLUMN IF NOT EXISTS partner_type TEXT;

-- Adicionar comentário
COMMENT ON COLUMN public.partner_invitations.partner_type IS 'Tipo de parceiro selecionado no cadastro: revenda, consultoria, integrador, afiliado, parceiro';

-- Criar índice para busca
CREATE INDEX IF NOT EXISTS idx_partner_invitations_partner_type 
ON public.partner_invitations(partner_type);
