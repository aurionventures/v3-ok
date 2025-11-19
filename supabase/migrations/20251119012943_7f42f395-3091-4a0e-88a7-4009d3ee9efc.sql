-- Inserir 9 órgãos de governança mockados para Legacy Governance
-- 3 Conselhos (Nível 1 - Estratégico)
INSERT INTO councils (company_id, name, type, organ_type, description, quorum, hierarchy_level, status) VALUES
('Legacy Governance', 'Conselho de Administração', 'administrativo', 'conselho', 'Conselho responsável pelas decisões estratégicas e pela orientação geral dos negócios da empresa', 3, 1, 'active'),
('Legacy Governance', 'Conselho Fiscal', 'fiscal', 'conselho', 'Conselho responsável pela fiscalização contábil, financeira e orçamentária da empresa', 3, 1, 'active'),
('Legacy Governance', 'Conselho Consultivo', 'consultivo', 'conselho', 'Conselho consultivo de especialistas externos para orientação estratégica e apoio à gestão', 5, 1, 'active');

-- 3 Comitês (Nível 2 - Tático)
INSERT INTO councils (company_id, name, type, organ_type, description, quorum, hierarchy_level, status) VALUES
('Legacy Governance', 'Comitê de Auditoria', 'auditoria', 'comite', 'Comitê responsável por supervisionar processos de auditoria interna e externa, controles e compliance', 3, 2, 'active'),
('Legacy Governance', 'Comitê de Estratégia', 'estrategia', 'comite', 'Comitê para definição, acompanhamento e revisão do planejamento estratégico da empresa', 4, 2, 'active'),
('Legacy Governance', 'Comitê de Riscos', 'outros', 'comite', 'Comitê para identificação, gestão e mitigação de riscos corporativos e operacionais', 3, 2, 'active');

-- 3 Comissões (Nível 3 - Operacional)
INSERT INTO councils (company_id, name, type, organ_type, description, quorum, hierarchy_level, status) VALUES
('Legacy Governance', 'Comissão de Ética', 'outros', 'comissao', 'Comissão temporária para análise de questões éticas, conduta corporativa e compliance regulatório', 3, 3, 'active'),
('Legacy Governance', 'Comissão de Inovação', 'outros', 'comissao', 'Comissão para avaliar, aprovar e acompanhar projetos de inovação e transformação digital', 4, 3, 'active'),
('Legacy Governance', 'Comissão de Sustentabilidade', 'outros', 'comissao', 'Comissão para desenvolvimento e acompanhamento de iniciativas ESG e sustentabilidade corporativa', 3, 3, 'active');

-- Inserir membros para Conselho de Administração (6 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status) 
SELECT id, 'Roberto Almeida Silva', 'Presidente', '2023-01-15', '2026-01-14', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Ana Paula Ferreira', 'Vice-Presidente', '2023-01-15', '2026-01-14', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Dr. Carlos Eduardo Santos', 'Conselheiro Independente', '2023-03-01', '2026-02-28', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Mariana Costa Lima', 'Conselheiro Independente', '2023-03-01', '2026-02-28', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Fernando Dias Oliveira', 'Conselheiro', '2024-01-10', '2027-01-09', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Juliana Rodrigues Martins', 'Conselheiro', '2024-01-10', '2027-01-09', 'active' FROM councils WHERE name = 'Conselho de Administração' AND company_id = 'Legacy Governance';

-- Inserir membros para Conselho Fiscal (3 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Patricia Mendes Souza', 'Presidente', '2023-06-01', '2025-05-31', 'active' FROM councils WHERE name = 'Conselho Fiscal' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Ricardo Barbosa Neto', 'Conselheiro Fiscal', '2023-06-01', '2025-05-31', 'active' FROM councils WHERE name = 'Conselho Fiscal' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Bruno Henrique Cardoso', 'Conselheiro Fiscal', '2023-08-15', '2025-08-14', 'active' FROM councils WHERE name = 'Conselho Fiscal' AND company_id = 'Legacy Governance';

-- Inserir membros para Conselho Consultivo (5 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Claudia Regina Alves', 'Coordenador', '2024-02-01', '2026-01-31', 'active' FROM councils WHERE name = 'Conselho Consultivo' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Dr. Marcelo Pereira Costa', 'Consultor Jurídico', '2024-03-15', '2026-03-14', 'active' FROM councils WHERE name = 'Conselho Consultivo' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Luciana Santos Oliveira', 'Consultor Estratégico', '2023-11-20', '2025-11-19', 'active' FROM councils WHERE name = 'Conselho Consultivo' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Eduardo Martins Ribeiro', 'Consultor de Inovação', '2024-01-08', '2026-01-07', 'active' FROM councils WHERE name = 'Conselho Consultivo' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Fernanda Lopes Garcia', 'Consultor de Mercado', '2024-04-01', '2026-03-31', 'active' FROM councils WHERE name = 'Conselho Consultivo' AND company_id = 'Legacy Governance';

-- Inserir membros para Comitê de Auditoria (4 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'João Pedro Almeida', 'Coordenador', '2023-07-01', '2025-06-30', 'active' FROM councils WHERE name = 'Comitê de Auditoria' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Maria Eduarda Costa', 'Membro', '2023-07-01', '2025-06-30', 'active' FROM councils WHERE name = 'Comitê de Auditoria' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Rafael Souza Santos', 'Membro', '2024-01-15', '2026-01-14', 'active' FROM councils WHERE name = 'Comitê de Auditoria' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Amanda Ferreira Lima', 'Membro', '2024-03-10', '2026-03-09', 'active' FROM councils WHERE name = 'Comitê de Auditoria' AND company_id = 'Legacy Governance';

-- Inserir membros para Comitê de Estratégia (4 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Gustavo Henrique Rocha', 'Coordenador', '2023-09-01', '2025-08-31', 'active' FROM councils WHERE name = 'Comitê de Estratégia' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Carolina Mendes Oliveira', 'Membro', '2023-09-01', '2025-08-31', 'active' FROM councils WHERE name = 'Comitê de Estratégia' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Paulo Ricardo Silva', 'Membro', '2024-02-20', '2026-02-19', 'active' FROM councils WHERE name = 'Comitê de Estratégia' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Beatriz Campos Pereira', 'Membro', '2024-05-01', '2026-04-30', 'active' FROM councils WHERE name = 'Comitê de Estratégia' AND company_id = 'Legacy Governance';

-- Inserir membros para Comitê de Riscos (3 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'André Luis Martins', 'Coordenador', '2023-10-01', '2025-09-30', 'active' FROM councils WHERE name = 'Comitê de Riscos' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Daniela Rodrigues Souza', 'Membro', '2023-10-01', '2025-09-30', 'active' FROM councils WHERE name = 'Comitê de Riscos' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Thiago Barbosa Lima', 'Membro', '2024-01-05', '2026-01-04', 'active' FROM councils WHERE name = 'Comitê de Riscos' AND company_id = 'Legacy Governance';

-- Inserir membros para Comissão de Ética (3 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Isabela Santos Alves', 'Presidente', '2024-01-15', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Ética' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Rodrigo Fernandes Costa', 'Membro', '2024-01-15', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Ética' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Camila Dias Ribeiro', 'Membro', '2024-01-15', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Ética' AND company_id = 'Legacy Governance';

-- Inserir membros para Comissão de Inovação (4 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Leonardo Silva Carvalho', 'Coordenador', '2024-02-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Inovação' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Natália Ferreira Gomes', 'Membro', '2024-02-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Inovação' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Gabriel Oliveira Santos', 'Membro', '2024-02-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Inovação' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Larissa Costa Martins', 'Membro', '2024-02-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Inovação' AND company_id = 'Legacy Governance';

-- Inserir membros para Comissão de Sustentabilidade (3 membros)
INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Marcelo Henrique Souza', 'Coordenador', '2024-03-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Sustentabilidade' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Vanessa Almeida Rocha', 'Membro', '2024-03-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Sustentabilidade' AND company_id = 'Legacy Governance';

INSERT INTO council_members (council_id, name, role, start_date, end_date, status)
SELECT id, 'Felipe Rodrigues Lima', 'Membro', '2024-03-01', '2025-12-31', 'active' FROM councils WHERE name = 'Comissão de Sustentabilidade' AND company_id = 'Legacy Governance';