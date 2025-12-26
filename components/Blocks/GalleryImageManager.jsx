"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload, ImageIcon, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const GalleryImageManager = ({ 
  projectId = null,
  isDarkMode = false,
  className = "",
  onImagesChange = null
}) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fetch images from project_images API
  const fetchProjectImages = async () => {
    if (!projectId) {
      // If no project ID, show appropriate message but don't show error
      setGalleryImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project-images?project_id=${projectId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure we have an array and filter for published images
      const images = Array.isArray(data) ? data.filter(img => img.status !== 'deleted') : [];
      setGalleryImages(images);
      
      // Notify parent component about image changes
      if (onImagesChange) {
        onImagesChange(images);
      }
    } catch (err) {
      console.error('Error fetching project images:', err);
      setError(err.message || 'Failed to fetch images');
      setGalleryImages([]); // Clear images on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch images when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProjectImages();
    }
  }, [projectId]);

  // Refresh images
  const handleRefreshImages = () => {
    fetchProjectImages();
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length || !projectId) return;

    setUploadingImages(true);
    
    try {
      // For now, we'll simulate the upload by creating image URLs
      // In a real implementation, you would upload to Supabase storage here
      const uploadPromises = files.map(async (file) => {
        // Create a temporary URL for preview (in production, upload to Supabase storage)
        const imageUrl = URL.createObjectURL(file);
        
        // Save to API with image metadata
        const response = await fetch('/api/project-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: projectId,
            image_url: imageUrl, // In production, this would be the Supabase storage URL
            caption: file.name,
            status: 'published'
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save ${file.name}`);
        }
        
        return await response.json();
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Update local state with new images
      const newImages = [...galleryImages, ...uploadedImages];
      setGalleryImages(newImages);
      
      // Notify parent component
      if (onImagesChange) {
        onImagesChange(newImages);
      }
      
      toast.success(`${files.length} image(s) uploaded successfully!`);
      
      // Clear the input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload images: ${error.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle delete image
  const handleDeleteImage = async (imageId) => {
    if (!imageId) return;

    setDeletingImageId(imageId);
    
    try {
      const response = await fetch(`/api/project-images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete image');
      }

      // Remove the image from local state
      const updatedImages = galleryImages.filter(img => img.id !== imageId);
      setGalleryImages(updatedImages);
      
      // Notify parent component about image changes
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }
      
      // Show success toast
      toast.success('Image deleted successfully', {
        description: 'The image has been removed from the gallery and storage.',
      });

      // Close confirmation dialog
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
      
    } catch (error) {
      console.error('Delete error:', error);
      
      // Show error toast
      toast.error('Failed to delete image', {
        description: error.message || 'An unexpected error occurred.',
      });
      
      // Close confirmation dialog on error
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    } finally {
      setDeletingImageId(null);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (image) => {
    setImageToDelete(image);
    setDeleteConfirmOpen(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setImageToDelete(null);
  };

  return (
    <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'} ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
            <ImageIcon className="h-5 w-5" />
            Project Gallery Images
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshImages}
              disabled={loading || !projectId}
              className={isDarkMode ? 'border-slate-600 text-slate-300' : ''}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1">Refresh</span>
            </Button>
          </div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {projectId 
            ? 'Manage images for this project. Upload images through the Project Images section.'
            : 'Project must be saved first before uploading images. Complete the project creation and then manage images here.'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images Summary & Upload */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {galleryImages.length}
            </div>
            <div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {galleryImages.length === 1 ? 'Image' : 'Images'}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                in gallery
              </div>
            </div>
          </div>
          {projectId && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="gallery-upload"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('gallery-upload').click()}
                disabled={loading || uploadingImages}
                className={isDarkMode ? 'border-slate-600 text-slate-300' : ''}
              >
                {uploadingImages ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-1" />
                )}
                {uploadingImages ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`p-8 rounded-lg border-2 border-dashed text-center ${
            isDarkMode ? 'border-slate-600 bg-slate-700/20' : 'border-gray-300 bg-gray-50'
          }`}>
            <Loader2 className={`h-8 w-8 mx-auto mb-3 animate-spin ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Loading project images...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`p-4 rounded-lg border border-red-200 bg-red-50 ${
            isDarkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4 text-red-500" />
              <h5 className={`text-sm font-medium ${
                isDarkMode ? 'text-red-400' : 'text-red-700'
              }`}>
                Error Loading Images
              </h5>
            </div>
            <p className={`text-xs ${
              isDarkMode ? 'text-red-300' : 'text-red-600'
            }`}>
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshImages}
              className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Images State */}
        {!loading && !error && galleryImages.length === 0 && (
          <div className={`p-8 rounded-lg border-2 border-dashed text-center ${
            isDarkMode ? 'border-slate-600 bg-slate-700/20' : 'border-gray-300 bg-gray-50'
          }`}>
            <ImageIcon className={`h-12 w-12 mx-auto mb-3 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <h4 className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              {!projectId ? 'Project Not Saved Yet' : 'No Images Found'}
            </h4>
            <p className={`text-xs mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {!projectId 
                ? 'Complete and save the project first, then return here to manage gallery images. You can upload images after the project is created.'
                : 'No images have been uploaded for this project yet. Images uploaded to the project will appear here automatically.'
              }
            </p>
            {!projectId && (
              <div className={`text-xs px-3 py-2 rounded mb-4 ${
                isDarkMode ? 'bg-blue-900/20 border border-blue-800 text-blue-200' : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}>
                <strong>Next Steps:</strong>
                <ul className="mt-2 text-left space-y-1">
                  <li>1. Complete the project information above</li>
                  <li>2. Click "Create Project" to save</li>
                  <li>3. Return to this section to manage images</li>
                  <li>4. Upload and organize your project gallery</li>
                </ul>
              </div>
            )}
            <div className={`text-xs px-3 py-2 rounded ${
              isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-white text-gray-600'
            }`}>
              <strong>Gallery Features:</strong>
              <ul className="mt-2 text-left space-y-1">
                <li>• Responsive masonry layout</li>
                <li>• Hover effects and transitions</li>
                <li>• Automatic image optimization</li>
                <li>• Click to view full size</li>
              </ul>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {!loading && !error && galleryImages.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                    <img
                      src={image.image_url || image.url || '/placeholder-image.jpg'}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-lg">
                      <p className="truncate">{image.caption}</p>
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm"
                      onClick={() => openDeleteConfirm(image)}
                      disabled={deletingImageId === image.id}
                    >
                      {deletingImageId === image.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`text-xs px-3 py-2 rounded ${
              isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>Gallery Features:</strong>
              <ul className="mt-2 text-left space-y-1">
                <li>• Responsive masonry layout</li>
                <li>• Hover effects and transitions</li>
                <li>• Automatic image optimization</li>
                <li>• Click to view full size</li>
              </ul>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h4 className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Image Management:
          </h4>
          <ul className={`text-xs space-y-1 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-600'
          }`}>
            {projectId ? (
              <>
                <li>1. Upload images using the "Upload Images" button above</li>
                <li>2. Images will automatically appear in this gallery</li>
                <li>3. Images are displayed in chronological order (newest first)</li>
                <li>4. Click the delete button on any image to remove it</li>
                <li>5. Only published project images will be shown</li>
                <li>6. Images are automatically deleted from storage when removed</li>
              </>
            ) : (
              <>
                <li>1. Complete project creation first</li>
                <li>2. Save the project to get a project ID</li>
                <li>3. Return to this section to manage images</li>
                <li>4. Upload and organize your project gallery</li>
                <li>5. Images will appear automatically after upload</li>
              </>
            )}
          </ul>
          {!projectId && (
            <div className={`mt-3 p-2 rounded text-xs ${
              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-gray-600'
            }`}>
              <strong>Note:</strong> Image upload functionality will be available after project creation.
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Sheet open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <SheetContent className={`${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
            <SheetHeader>
              <SheetTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Image
              </SheetTitle>
              <SheetDescription className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                Are you sure you want to delete this image? This action cannot be undone.
              </SheetDescription>
            </SheetHeader>
            
            {/* Image Preview */}
            {imageToDelete && (
              <div className="mt-4 space-y-3">
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={imageToDelete.image_url || imageToDelete.url || '/placeholder-image.jpg'}
                      alt={imageToDelete.caption || 'Image to delete'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  {imageToDelete.caption && (
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      <strong>Caption:</strong> {imageToDelete.caption}
                    </p>
                  )}
                </div>
              </div>
            )}

            <SheetFooter className="mt-6">
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={deletingImageId === imageToDelete?.id}
                  className={`flex-1 ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300'}`}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteImage(imageToDelete?.id)}
                  disabled={deletingImageId === imageToDelete?.id}
                  className="flex-1"
                >
                  {deletingImageId === imageToDelete?.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Image
                    </>
                  )}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default GalleryImageManager;