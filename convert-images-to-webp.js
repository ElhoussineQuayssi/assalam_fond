/**
 * convert-images-to-webp.js
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node convert-images-to-webp.js
 *
 * Notes:
 * - Installs: npm i @supabase/supabase-js sharp p-limit
 * - Runs server-side (requires service role key).
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const sharp = require("sharp");
const { default: pLimit } = require("p-limit");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "projects";
const BATCH_SIZE = 3; // number of files processed in parallel
const MAX_ITEMS = null; // set to a number for testing, or null for all
const MIN_BYTES = 0; // convert all files regardless of size
const RETRY_COUNT = 1;
const WEBP_QUALITY = 80; // 0-100

// helper: normalize and extract storage path from a supabase public URL
function extractStoragePathFromUrl(url) {
  if (!url) return null;
  const s = url.toString().trim().replace(/^"|"$/g, ""); // strip quotes
  // If it contains /storage/v1/object/public/<bucket>/
  const marker = "/storage/v1/object/public/";
  const idx = s.indexOf(marker);
  if (idx >= 0) {
    const path = s.slice(idx + marker.length); // this yields "<bucket>/<path...>"
    // remove bucket prefix if present
    if (path.startsWith(`${BUCKET}/`)) {
      return decodeURIComponent(path.slice(BUCKET.length + 1));
    } else {
      // if bucket mismatch, still return entire path
      return decodeURIComponent(path);
    }
  }
  // Otherwise perhaps the DB stored raw path already
  // Return decodeURI of the last segment after bucket name
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// download file: prefer storage API (service role) for reliability
async function downloadFromStorage(path) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) {
    throw error;
  }
  // In Node, `data` may be a ReadableStream or Buffer. Convert to Buffer.
  const buffer = (await data.arrayBuffer)
    ? Buffer.from(await data.arrayBuffer())
    : Buffer.from(await streamToBuffer(data));
  return buffer;
}

// helper: convert ReadableStream to Buffer (fallback)
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

// upload buffer to storage at path
async function uploadToStorage(path, buffer, contentType = "image/webp") {
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  // get public url
  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicData?.publicUrl || null;
}

// convert image buffer to webp using sharp
async function convertBufferToWebp(buffer) {
  // adjust options as needed (webp vs avif)
  return await sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer();
}

// main worker for one DB row
async function processImageRow(row) {
  const id = row.id;
  try {
    if (!row.image_url) {
      console.log(`[skip ${id}] missing image_url`);
      return { id, skipped: true, reason: "no_url" };
    }
    // normalize and extract path
    const storagePathGuess = extractStoragePathFromUrl(row.image_url);
    if (!storagePathGuess) {
      console.log(`[skip ${id}] could not extract storage path from url`);
      return { id, skipped: true, reason: "bad_url" };
    }
    // Only process jpg/jpeg/png
    const lower = storagePathGuess.toLowerCase();
    if (!/\.(jpe?g|png)$/i.test(lower)) {
      console.log(`[skip ${id}] not jpg/png`);
      return { id, skipped: true, reason: "not_image" };
    }

    // download
    let originalBuffer;
    try {
      originalBuffer = await downloadFromStorage(storagePathGuess);
    } catch (err) {
      console.error(
        `[error ${id}] download failed for path=${storagePathGuess}`,
        err.message || err,
      );
      return { id, error: true, reason: "download_failed", err };
    }

    const bytes = originalBuffer.length;
    if (bytes < MIN_BYTES) {
      console.log(`[skip ${id}] small file (${(bytes / 1024).toFixed(1)} KB)`);
      return { id, skipped: true, reason: "small" };
    }

    // convert
    let webpBuf;
    try {
      webpBuf = await convertBufferToWebp(originalBuffer);
    } catch (err) {
      console.error(`[error ${id}] conversion failed:`, err.message || err);
      return { id, error: true, reason: "convert_failed", err };
    }

    // choose new path: place under same folder with .webp suffix
    // e.g. original: "Kafala/Camp/DSC08261.JPG" -> new: "Kafala/Camp/DSC08261.webp"
    const parts = storagePathGuess.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");
    const baseName = filename.replace(/\.[^/.]+$/, ""); // remove extension
    const newPath = folder ? `${folder}/${baseName}.webp` : `${baseName}.webp`;

    // upload
    let publicUrl;
    try {
      publicUrl = await uploadToStorage(newPath, webpBuf, "image/webp");
    } catch (err) {
      console.error(
        `[error ${id}] upload failed for ${newPath}:`,
        err.message || err,
      );
      return { id, error: true, reason: "upload_failed", err };
    }

    // store original url to original_image_url if column exists and not populated
    try {
      if (row.original_image_url != null) {
        // column exists; only set if empty
        if (!row.original_image_url) {
          await supabase
            .from("project_images")
            .update({ original_image_url: row.image_url })
            .eq("id", id);
        }
      }
    } catch (err) {
      console.warn(
        `[warn ${id}] failed updating original_image_url:`,
        err.message || err,
      );
    }

    // update DB record to new public URL
    try {
      const { error } = await supabase
        .from("project_images")
        .update({ image_url: publicUrl })
        .eq("id", id);
      if (error) {
        console.error(`[error ${id}] updating DB image_url failed:`, error);
        return { id, error: true, reason: "db_update_failed", err: error };
      }
    } catch (err) {
      console.error(`[error ${id}] DB update exception:`, err.message || err);
      return { id, error: true, reason: "db_update_exception", err };
    }

    console.log(`[ok ${id}] converted and updated => ${publicUrl}`);
    return { id, ok: true, publicUrl };
  } catch (fatal) {
    console.error(`[fatal ${id}]`, fatal);
    return { id, error: true, reason: "fatal", err: fatal };
  }
}

// high-level processing loop with concurrency and retries
async function run() {
  console.log("Starting conversion job...");

  // Fetch rows to process. Adjust select and filters as needed.
  // Filter: image_url contains .jpg or .jpeg or .png (case-insensitive).
  // Add limit for testing (MAX_ITEMS).
  const query = supabase
    .from("project_images")
    .select("id,image_url,original_image_url")
    .order("created_at", { ascending: true });
  // you can add .filter('image_url','ilike','%.jpg%') but supabase ilike patterns need %
  // We'll fetch all and filter client-side for safety.
  const { data: rows, error } = await query;
  if (error) {
    console.error("Failed to fetch project_images:", error);
    process.exit(1);
  }

  let toProcess = rows.filter(
    (r) =>
      r?.image_url && /\.(jpe?g|png)$/i.test((r.image_url || "").toString()),
  );
  if (MAX_ITEMS) toProcess = toProcess.slice(0, MAX_ITEMS);

  console.log(`Total candidate images: ${toProcess.length}`);

  const limit = pLimit(BATCH_SIZE);

  // wrap with retry logic for each image
  const tasks = toProcess.map((row) =>
    limit(async () => {
      let attempts = 0;
      while (attempts <= RETRY_COUNT) {
        attempts++;
        const res = await processImageRow(row);
        if (!res.error) return res;
        console.log(
          `[retry ${attempts}] for ${row.id} due to ${res.reason || "error"}`,
        );
        // backoff before retry
        await new Promise((r) => setTimeout(r, 500 * attempts));
      }
      return { id: row.id, error: true, reason: "all_retries_failed" };
    }),
  );

  const results = await Promise.all(tasks);

  const summary = results.reduce(
    (acc, r) => {
      if (r.ok) acc.ok++;
      else if (r.skipped) acc.skipped++;
      else acc.failed++;
      return acc;
    },
    { ok: 0, skipped: 0, failed: 0 },
  );

  console.log("Conversion finished:", summary);
  process.exit(0);
}

// Run
run().catch((err) => {
  console.error("Job failed:", err);
  process.exit(1);
});
