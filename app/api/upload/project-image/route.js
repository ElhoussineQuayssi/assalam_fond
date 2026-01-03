import { NextResponse } from "next/server";
import sharp from "sharp";
import { generateUniqueFilename } from "@/utils/imageUtils";
import { createAdminClient } from "@/utils/supabase/client";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket") || "projects";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    const supabase = await createAdminClient();

    // Check if bucket exists and create if needed
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);

    if (!bucketExists) {
      console.log(`Creating bucket: ${bucket}`);
      const { error: createError } = await supabase.storage.createBucket(
        bucket,
        {
          public: true,
          allowedMimeTypes: [
            "image/webp",
            "image/jpeg",
            "image/png",
            "image/gif",
          ],
          fileSizeLimit: 5242880, // 5MB
        },
      );
      if (createError) {
        console.error("Error creating bucket:", createError);
        // Continue anyway, bucket might already exist
      }
    }

    // Convert image to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP
    const webpBuffer = await sharp(buffer)
      .webp({
        quality: 80,
        effort: 6,
      })
      .toBuffer();

    // Generate unique filename
    const fileName = generateUniqueFilename(
      file.name,
      bucket === "projects" ? "project" : "blog",
    );
    const filePath = `${bucket}/${fileName}`;

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, webpBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: true, // Allow overwriting existing files
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        {
          error: "Failed to upload file",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      bucket: bucket,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
