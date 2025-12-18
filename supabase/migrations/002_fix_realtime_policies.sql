-- Fix realtime policies for messages table
-- Run this if chat realtime isn't working

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;

-- Create more permissive policy for realtime
DROP POLICY IF EXISTS "Users can view conversation messages" ON public.messages;
CREATE POLICY "Users can view conversation messages"
  ON public.messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

-- Keep the send policy
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Add realtime enable policy
DROP POLICY IF EXISTS "Enable realtime for messages" ON public.messages;
CREATE POLICY "Enable realtime for messages"
  ON public.messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Ensure RLS is enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Add a comment for clarity
COMMENT ON TABLE public.messages IS 'Chat messages with realtime support enabled';
