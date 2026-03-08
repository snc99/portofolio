import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Cloudinary environment variables are not configured properly.",
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Generate safe public ID from filename
 */
function generatePublicId(filename: string) {
  const baseName = filename.split(".")[0];
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Upload file to Cloudinary
 * @param file File to upload
 * @param folder Optional folder name
 * @returns Uploaded file secure URL
 */
export async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const publicId = generatePublicId(file.name);

    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder || undefined,
          public_id: publicId,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (!result?.secure_url) {
            reject(new Error("Upload failed: No secure URL returned"));
          } else {
            resolve(result.secure_url);
          }
        },
      );

      stream.end(buffer);
    });
  } catch (error: any) {
    throw new Error(`Upload error: ${error.message}`);
  }
}

/**
 * Delete file from Cloudinary using its URL
 * @param url File URL
 */
export async function deleteFromCloudinary(url: string) {
  try {
    if (!url) throw new Error("Invalid Cloudinary URL");

    const parts = url.split("/upload/");
    if (parts.length < 2) throw new Error("Malformed Cloudinary URL");

    let publicId = parts[1]
      .replace(/^v\d+\//, "") // remove version
      .replace(/\.[^/.]+$/, ""); // remove extension

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Failed to delete file from Cloudinary");
    }

    return result;
  } catch (error: any) {
    throw new Error(`Cloudinary delete error: ${error.message}`);
  }
}

/**
 * Replace existing file with a new one
 * @param oldUrl Existing file URL
 * @param newFile New file to upload
 * @param folder Optional folder
 * @returns New uploaded file URL
 */
export async function updateCloudinaryFile(
  oldUrl: string,
  newFile: File,
  folder?: string,
): Promise<string> {
  try {
    if (oldUrl) await deleteFromCloudinary(oldUrl);
    return await uploadToCloudinary(newFile, folder);
  } catch (error: any) {
    throw new Error(`Cloudinary update failed: ${error.message}`);
  }
}
