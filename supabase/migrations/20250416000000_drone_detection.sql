
-- Create the drone_detections table
CREATE TABLE IF NOT EXISTS drone_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drone_id TEXT NOT NULL,
  drone_name TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  detected_image_url TEXT NOT NULL,
  reference_image_url TEXT NOT NULL,
  specifications JSONB NOT NULL,
  analysis_data JSONB NOT NULL,
  detection_methods JSONB NOT NULL,
  threat_level TEXT NOT NULL,
  detection_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON drone_detections(user_id);

-- Set up RLS (Row Level Security)
ALTER TABLE drone_detections ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own detections
CREATE POLICY "Users can view their own detections" 
  ON drone_detections 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own detections
CREATE POLICY "Users can insert their own detections" 
  ON drone_detections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for drone images
CREATE POLICY "Public access to drone images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'drone-detection');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'drone-detection' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
