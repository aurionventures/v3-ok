-- Limpa dados de maturidade (diagnósticos) da Empresa Demo
DELETE FROM diagnosticos
WHERE empresa_id IN (SELECT id FROM empresas WHERE lower(nome) = 'empresa demo');
