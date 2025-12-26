import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const getAllProjectImages = async (filters = {}) => {
  let query = supabase
    .from('project_images')
    .select('*');

  // Apply filters if provided
  if (filters.project_id) {
    query = query.eq('project_id', filters.project_id);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Order by created_at descending (newest first)
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const createProjectImage = async (imageData) => {
  const { data, error } = await supabase
    .from('project_images')
    .insert([imageData])
    .select();

  if (error) throw error;
  return data[0];
};

export const getProjectImageById = async (id) => {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Project image not found');
  return data;
};

export const updateProjectImage = async (id, updateData) => {
  const { data, error } = await supabase
    .from('project_images')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Project image not found');
  return data[0];
};

export const deleteProjectImage = async (id) => {
  // First, get the image details to extract file path for storage deletion
  const imageData = await getProjectImageById(id);
  
  if (!imageData) {
    throw new Error('Project image not found');
  }

  // Extract file path from Supabase storage URL
  const imageUrl = imageData.image_url || imageData.url;
  if (imageUrl) {
    try {
      // Extract file path from Supabase URL
      // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = imageUrl.split('/storage/v1/object/public/');
      if (urlParts.length === 2) {
        const bucketAndPath = urlParts[1];
        const pathParts = bucketAndPath.split('/');
        if (pathParts.length >= 2) {
          const bucketName = pathParts[0];
          const filePath = pathParts.slice(1).join('/');
          
          // Delete file from storage
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);
            
          if (storageError) {
            console.warn('Failed to delete file from storage:', storageError);
            // Continue with database deletion even if storage deletion fails
            // This prevents orphaned database records
          }
        }
      }
    } catch (storageError) {
      console.warn('Error processing storage URL for deletion:', storageError);
      // Continue with database deletion
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  return { success: true, message: 'Project image deleted successfully' };
};