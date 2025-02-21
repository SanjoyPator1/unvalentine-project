-- Drop table if exists (this will automatically drop associated policies)
DROP TABLE IF EXISTS public.notes;

-- Create notes table
CREATE TABLE public.notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address TEXT NOT NULL,
    device_id TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read notes"
    ON public.notes 
    FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX idx_notes_created_at ON public.notes (created_at DESC);
CREATE INDEX idx_notes_ip_rate_limit ON public.notes (ip_address, created_at);

-- Grant necessary permissions
GRANT SELECT ON public.notes TO anon;
GRANT INSERT ON public.notes TO anon;