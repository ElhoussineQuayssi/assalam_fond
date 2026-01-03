require("dotenv").config({ path: ".env.local" });
const { createClient } = require("./utils/supabase/client");

async function fixDoubleEncodedUrls() {
  const supabase = createClient();

  console.log("Starting URL encoding fix...");

  // Get all project images
  const { data: images, error } = await supabase
    .from("project_images")
    .select("id, image_url");

  if (error) {
    console.error("Error fetching images:", error);
    return;
  }

  console.log(`Found ${images.length} images to check`);

  // Show first few URLs as examples
  console.log("Sample URLs:");
  images.slice(0, 3).forEach((img, i) => {
    console.log(`${i + 1}. ${img.image_url}`);
  });

  let fixedCount = 0;

  for (const image of images) {
    const originalUrl = image.image_url;

    // Check if URL contains encoded spaces that might get double-encoded
    if (
      originalUrl &&
      (originalUrl.includes("%2520") || originalUrl.includes("%20"))
    ) {
      try {
        // Decode the double-encoded URL
        const fixedUrl = decodeURIComponent(originalUrl);

        // Update the database
        const { error: updateError } = await supabase
          .from("project_images")
          .update({ image_url: fixedUrl })
          .eq("id", image.id);

        if (updateError) {
          console.error(`Failed to update image ${image.id}:`, updateError);
        } else {
          console.log(`Fixed: ${originalUrl} -> ${fixedUrl}`);
          fixedCount++;
        }
      } catch (decodeError) {
        console.error(
          `Failed to decode URL for image ${image.id}:`,
          decodeError,
        );
      }
    }
  }

  console.log(`Fixed ${fixedCount} double-encoded URLs`);
}

// Run the script
fixDoubleEncodedUrls()
  .then(() => {
    console.log("URL encoding fix completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
