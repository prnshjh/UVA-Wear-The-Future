-- Create designs table
CREATE TABLE designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  canvas_data JSONB NOT NULL,
  preview_image TEXT,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own designs"
  ON designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs"
  ON designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
  ON designs FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for design assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-assets', 'design-assets', true);

-- Storage policies
CREATE POLICY "Users can upload their design assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'design-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view design assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-assets');

CREATE POLICY "Users can update their own design assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'design-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own design assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'design-assets' AND auth.uid()::text = (storage.foldername(name))[1]);