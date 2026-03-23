-- data_prazo: prazo esperado (deadline). data_conclusao: apenas quando tarefa foi concluída.
ALTER TABLE reuniao_tarefas ADD COLUMN IF NOT EXISTS data_prazo date;
