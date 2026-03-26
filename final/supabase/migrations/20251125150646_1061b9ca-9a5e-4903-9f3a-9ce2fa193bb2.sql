-- =====================================================
-- POLÍTICAS DE ACESSO ABERTO PARA AMBIENTE DE DEMO
-- =====================================================

-- 1. COUNCILS - Órgãos de governança
CREATE POLICY "Demo open access for councils"
ON public.councils FOR SELECT
TO anon, authenticated
USING (true);

-- 2. MEETINGS - Reuniões
CREATE POLICY "Demo open access for meetings"
ON public.meetings FOR SELECT
TO anon, authenticated
USING (true);

-- 3. MEETING_ACTIONS - Tarefas/Pendências
CREATE POLICY "Demo open access for meeting_actions"
ON public.meeting_actions FOR SELECT
TO anon, authenticated
USING (true);

-- 4. MEETING_ITEMS - Pautas
CREATE POLICY "Demo open access for meeting_items"
ON public.meeting_items FOR SELECT
TO anon, authenticated
USING (true);

-- 5. MEETING_PARTICIPANTS - Participantes
CREATE POLICY "Demo open access for meeting_participants"
ON public.meeting_participants FOR SELECT
TO anon, authenticated
USING (true);

-- 6. MEETING_DOCUMENTS - Documentos
CREATE POLICY "Demo open access for meeting_documents"
ON public.meeting_documents FOR SELECT
TO anon, authenticated
USING (true);

-- 7. CORPORATE_STRUCTURE_MEMBERS - Membros corporativos
CREATE POLICY "Demo open access for corporate_structure_members"
ON public.corporate_structure_members FOR SELECT
TO anon, authenticated
USING (true);

-- 8. COUNCIL_MEMBERS - Membros de conselhos
CREATE POLICY "Demo open access for council_members"
ON public.council_members FOR SELECT
TO anon, authenticated
USING (true);

-- 9. INTERVIEWS - Entrevistas
CREATE POLICY "Demo open access for interviews"
ON public.interviews FOR SELECT
TO anon, authenticated
USING (true);

-- 10. INTERVIEW_TRANSCRIPTS - Transcrições
CREATE POLICY "Demo open access for interview_transcripts"
ON public.interview_transcripts FOR SELECT
TO anon, authenticated
USING (true);

-- 11. COUNCIL_REMINDER_CONFIG - Configurações de lembretes
CREATE POLICY "Demo open access for council_reminder_config"
ON public.council_reminder_config FOR SELECT
TO anon, authenticated
USING (true);

-- 12. GUEST_TOKENS - Tokens de convidados
CREATE POLICY "Demo open access for guest_tokens"
ON public.guest_tokens FOR SELECT
TO anon, authenticated
USING (true);

-- 13. USERS - Usuários
CREATE POLICY "Demo open access for users"
ON public.users FOR SELECT
TO anon, authenticated
USING (true);

-- 14. USER_ROLES - Papéis de usuários
CREATE POLICY "Demo open access for user_roles"
ON public.user_roles FOR SELECT
TO anon, authenticated
USING (true);

-- 15. NOTIFICATIONS - Notificações
CREATE POLICY "Demo open access for notifications"
ON public.notifications FOR SELECT
TO anon, authenticated
USING (true);