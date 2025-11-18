-- Fix security warnings: set search_path to empty string for all functions

ALTER FUNCTION public.update_meetings_updated_at() SET search_path = '';
ALTER FUNCTION public.update_meeting_actions_overdue() SET search_path = '';
ALTER FUNCTION public.set_meeting_actions_completed_at() SET search_path = '';