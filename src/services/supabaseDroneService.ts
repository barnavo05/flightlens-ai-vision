
import { supabase } from '@/lib/supabase';
import { DroneDetectionResult } from '@/services/droneDetection';
import { toast } from 'sonner';

// Type for Supabase stored detection result
export interface StoredDetectionResult {
  id?: string;
  user_id: string;
  drone_id: string;
  drone_name: string;
  confidence: number;
  detected_image_url: string;
  reference_image_url: string;
  specifications: Record<string, string>;
  analysis_data: Record<string, string>;
  detection_methods: Array<{ name: string; accuracy: number }>;
  threat_level: string;
  detection_time: string;
  created_at?: string;
}

// Upload an image to Supabase storage
export async function uploadImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `drone-images/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('drone-detection')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      console.error(uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('drone-detection')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}

// Save detection result to Supabase
export async function saveDetectionToSupabase(
  result: DroneDetectionResult,
  userId: string
): Promise<boolean> {
  try {
    // Convert the local result format to Supabase format
    const storedResult: StoredDetectionResult = {
      user_id: userId,
      drone_id: result.droneId,
      drone_name: result.droneName,
      confidence: result.confidence,
      detected_image_url: result.detectedImage,
      reference_image_url: result.referenceImage,
      specifications: result.specifications,
      analysis_data: result.analysisData,
      detection_methods: result.detectionMethods,
      threat_level: result.threatLevel,
      detection_time: result.detectionTime
    };

    const { error } = await supabase
      .from('drone_detections')
      .insert(storedResult);

    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Failed to save detection result');
      return false;
    }

    toast.success('Detection result saved to database');
    return true;
  } catch (error) {
    console.error('Error saving detection result:', error);
    toast.error('Failed to save detection result');
    return false;
  }
}

// Get all detection results for a user
export async function getUserDetections(userId: string): Promise<StoredDetectionResult[]> {
  try {
    const { data, error } = await supabase
      .from('drone_detections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user detections:', error);
      toast.error('Failed to fetch detection history');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching detection history:', error);
    toast.error('Failed to fetch detection history');
    return [];
  }
}
