"use client";
import { ArrowDown, ArrowUp, ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GalleryImageManager({
  isDarkMode = false,
  images = [],
  onImagesChange,
}) {
  const [_uploadingImages, _setUploadingImages] = useState(new Set());
  const fileInputRef = useRef(null);

  // Generate preview URL for newly uploaded files
  const generatePreviewUrl = (file) => {
    return URL.createObjectURL(file);
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const validFiles = [];
    const errors = [];

    // Validate files
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not a valid image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        errors.push(`${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
    }

    if (validFiles.length === 0) return;

    // Add valid files to local state
    const newImages = validFiles.map((file, index) => ({
      id: undefined, // Will be assigned by database
      file: file,
      image_url: generatePreviewUrl(file),
      caption: "",
      order: images.length + index,
      action: "create",
    }));

    // Update parent state
    onImagesChange([...images, ...newImages]);

    // Clear input
    event.target.value = "";
  };

  // Update image caption
  const updateCaption = (index, caption) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], caption };
    onImagesChange(updatedImages);
  };

  // Move image up in order
  const moveImageUp = (index) => {
    if (index === 0) return;

    const updatedImages = [...images];
    [updatedImages[index - 1], updatedImages[index]] = [
      updatedImages[index],
      updatedImages[index - 1],
    ];

    // Update order values
    updatedImages.forEach((img, i) => {
      img.order = i;
    });

    onImagesChange(updatedImages);
  };

  // Move image down in order
  const moveImageDown = (index) => {
    if (index === images.length - 1) return;

    const updatedImages = [...images];
    [updatedImages[index], updatedImages[index + 1]] = [
      updatedImages[index + 1],
      updatedImages[index],
    ];

    // Update order values
    updatedImages.forEach((img, i) => {
      img.order = i;
    });

    onImagesChange(updatedImages);
  };

  // Mark image for deletion (soft delete)
  const markForDeletion = (index) => {
    const updatedImages = [...images];
    const image = updatedImages[index];

    if (image.id) {
      // Existing image: mark for deletion
      updatedImages[index] = { ...image, action: "delete" };
    } else {
      // New image: remove from local state
      updatedImages.splice(index, 1);
      // Reorder remaining images
      updatedImages.forEach((img, i) => {
        img.order = i;
      });
    }

    onImagesChange(updatedImages);
  };

  // Get displayable images (exclude marked for deletion)
  const displayableImages = images.filter((img) => img.action !== "delete");

  return (
    <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <Label className="text-lg font-semibold">
                Gallery Images ({displayableImages.length})
              </Label>
            </div>

            {/* Upload Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Add Images
            </Button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Instructions */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Supported formats: JPG, PNG, GIF, WebP (max 5MB each)</p>
            <p>Select multiple files to add them at once</p>
          </div>

          {/* Images Grid */}
          {displayableImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayableImages.map((image, index) => (
                <div
                  key={image.id || `new-${index}`}
                  className={`relative group border rounded-lg overflow-hidden ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  {/* Image Preview */}
                  <div className="aspect-square relative">
                    {image.file ? (
                      // Use <img> for local file previews (blob URLs can't be optimized)
                      <img
                        src={image.image_url}
                        alt={image.caption || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    ) : (
                      // Use <Image> for persisted images (Supabase URLs can be optimized)
                      (() => {
                        const cleanedUrl = (image.image_url || "")
                          .toString()
                          .replace(/^"|"$/g, ""); // remove leading/trailing quotes

                        return (
                          <Image
                            src={encodeURI(cleanedUrl)}
                            alt={image.caption || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        );
                      })()
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => markForDeletion(images.indexOf(image))}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* New image indicator */}
                    {!image.id && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                  </div>

                  {/* Image Controls */}
                  <div className="p-3 space-y-2">
                    {/* Order Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageUp(images.indexOf(image))}
                          disabled={index === 0}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageDown(images.indexOf(image))}
                          disabled={index === displayableImages.length - 1}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-xs text-gray-500">
                        #{image.order + 1}
                      </span>
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-1">
                      <Label className="text-xs">Caption (optional)</Label>
                      <Input
                        value={image.caption || ""}
                        onChange={(e) =>
                          updateCaption(images.indexOf(image), e.target.value)
                        }
                        placeholder="Add a caption..."
                        className="text-sm h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No gallery images yet</p>
              <p className="text-sm">Click "Add Images" to get started</p>
            </div>
          )}

          {/* Pending Deletions Info */}
          {images.some((img) => img.action === "delete") && (
            <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <strong>Note:</strong>{" "}
              {images.filter((img) => img.action === "delete").length} image(s)
              marked for deletion will be removed when you save the project.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
