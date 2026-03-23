-- Seed: empresa demo para desenvolvimento e testes
-- Só insere se a tabela empresas estiver vazia
INSERT INTO empresas (nome, ativo)
SELECT 'Empresa Demo', true
WHERE NOT EXISTS (SELECT 1 FROM empresas LIMIT 1);
