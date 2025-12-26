"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload, ImageIcon, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const GalleryImageManagerLocal = ({ 
  projectId = null,
  isDarkMode = false,
  className = "",
  images = [],
  onImagesChange = () => {}
}) => {
  const [localImages, setLocalImages] = useState(images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  // Update local images when props change
  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  // Notify parent component about image changes
  useEffect(() => {
    onImagesChange(localImages);
  }, [localImages, onImagesChange]);

  // Refresh images (fetch from existing project if needed)
  const handleRefreshImages = async () => {
    if (!projectId) {
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
      const fetchedImages = Array.isArray(data) ? data.filter(img => img.status !== 'deleted') : [];
      setLocalImages(fetchedImages);
      
      toast.success('Gallery images refreshed successfully!');
      
    } catch (err) {
      console.error('Error fetching project images:', err);
      setError(err.message || 'Failed to fetch images');
      toast.error(`Failed to refresh images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploadingImages(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Create a temporary URL for preview (in production, upload to Supabase storage)
        const imageUrl = URL.createObjectURL(file);
        
        // Create a new image object
        const newImage = {
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          project_id: projectId,
          image_url: imageUrl,
          caption: file.name,
          status: 'published',
          isLocal: true, // Flag to indicate this is a new local image
          file: file // Store the actual file for later upload
        };
        
        return newImage;
      });
      
      const newImages = await Promise.all(uploadPromises);
      
      // Update local state with new images
      const updatedImages = [...localImages, ...newImages];
      setLocalImages(updatedImages);
      
      toast.success(`${files.length} image(s) added to gallery!`);
      
      // Clear the input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to add images: ${error.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle delete image
  const handleDeleteImage = async (imageId) => {
    if (!imageId) return;

    setDeletingImageId(imageId);
    
    try {
      const image = localImages.find(img => img.id === imageId);
      
      // If this is an existing image (not temporary), delete from API
      if (image && !image.isLocal && projectId) {
        const response = await fetch(`/api/project-images/${imageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete image from server');
        }
      }

      // Remove the image from local state
      const updatedImages = localImages.filter(img => img.id !== imageId);
      setLocalImages(updatedImages);
      
      // Show success toast
      toast.success('Image removed successfully');
      
      // Close confirmation dialog
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
      
    } catch (error) {
      console.error('Delete error:', error);
      
      // Show error toast
      toast.error('Failed to delete image: ' + error.message);
      
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

  // Helper function to get image URL with fallback
  const getImageUrl = (image) => {
    const url = image.image_url || image.url;
    if (!url) {
      return '/placeholder-image.svg';
    }
    
    // If it's a local blob URL, use it directly
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    
    // For remote URLs, add error handling
    return url;
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
            {projectId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshImages}
                disabled={loading}
                className={isDarkMode ? 'border-slate-600 text-slate-300' : ''}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-1">Refresh</span>
              </Button>
            )}
          </div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {projectId 
            ? 'Manage images for this project. Upload images to add them to the gallery.'
            : 'Images will be available after project creation. Add images here and they will be uploaded with the project.'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images Summary & Upload */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {localImages.length}
            </div>
            <div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {localImages.length === 1 ? 'Image' : 'Images'}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                in gallery
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
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
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
              className={isDarkMode ? 'border-slate-600 text-slate-300' : ''}
            >
              {uploadingImages ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              {uploadingImages ? 'Adding...' : 'Add Images'}
            </Button>
          </div>
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
        {!loading && !error && localImages.length === 0 && (
          <div className={`p-8 rounded-lg border-2 border-dashed text-center ${
            isDarkMode ? 'border-slate-600 bg-slate-700/20' : 'border-gray-300 bg-gray-50'
          }`}>
            <ImageIcon className={`h-12 w-12 mx-auto mb-3 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <h4 className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              No Images Yet
            </h4>
            <p className={`text-xs mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Start building your project gallery by adding images. They will be uploaded along with your project.
            </p>
            <div className={`text-xs px-3 py-2 rounded ${
              isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-white text-gray-600'
            }`}>
              <strong>Gallery Features:</strong>
              <ul className="mt-2 text-left space-y-1">
                <li>• Multiple image support</li>
                <li>• Drag & drop ready</li>
                <li>• Automatic optimization</li>
                <li>• Easy management</li>
              </ul>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {!loading && !error && localImages.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {localImages.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                    <img
                      src={getImageUrl(image)}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg';
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
                  
                  {/* Local Image Indicator */}
                  {image.isLocal && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className={`text-xs px-3 py-2 rounded ${
              isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>Gallery Status:</strong> {localImages.length} image(s) ready for upload
              {localImages.some(img => img.isLocal) && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  • {localImages.filter(img => img.isLocal).length} new image(s)
                </span>
              )}
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
            <li>1. Add images using the "Add Images" button above</li>
            <li>2. Images are managed locally and uploaded with the project</li>
            <li>3. New images are marked with a "New" badge</li>
            <li>4. Remove images by clicking the delete button</li>
            <li>5. Images will be automatically optimized during upload</li>
          </ul>
        </div>

        {/* Delete Confirmation Dialog */}
        <Sheet open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <SheetContent className={`${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
            <SheetHeader>
              <SheetTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Remove Image
              </SheetTitle>
              <SheetDescription className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                Are you sure you want to remove this image from the gallery?
              </SheetDescription>
            </SheetHeader>
            
            {/* Image Preview */}
            {imageToDelete && (
              <div className="mt-4 space-y-3">
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={getImageUrl(imageToDelete)}
                      alt={imageToDelete.caption || 'Image to remove'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                  {imageToDelete.caption && (
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      <strong>Caption:</strong> {imageToDelete.caption}
                    </p>
                  )}
                  {imageToDelete.isLocal && (
                    <p className={`text-xs text-blue-600 dark:text-blue-400 mt-1`}>
                      This is a new image that will be uploaded with the project
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
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Image
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

export default GalleryImageManagerLocal;