CREATE TABLE public.briefing_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  topic TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.briefing_requests TO anon, authenticated;
GRANT ALL ON public.briefing_requests TO service_role;
ALTER TABLE public.briefing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a briefing request"
  ON public.briefing_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND length(company) BETWEEN 1 AND 200
    AND length(topic) BETWEEN 1 AND 200
    AND length(details) BETWEEN 1 AND 4000
    AND (role IS NULL OR length(role) <= 120)
  );