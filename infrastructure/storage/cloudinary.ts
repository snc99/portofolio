import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file ke Cloudinary
 * @param {File} file - File yang akan diupload
 * @param {string} folder - Nama folder di Cloudinary (opsional)
 * @returns {Promise<string>} URL file yang sudah diupload
 */

export async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder || undefined,
          public_id: file.name.split(".")[0], // Menggunakan nama asli file (tanpa ekstensi)
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Upload gagal: ${error.message}`));
          } else {
            resolve(result?.secure_url || "");
          }
        },
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Terjadi kesalahan saat mengupload file: ${error}`);
  }
}

/**
 * Hapus file dari Cloudinary
 * @param {string} url - URL file yang ingin dihapus
 * @returns {Promise<any>} Response dari Cloudinary
 */
export async function deleteFromCloudinary(url: string) {
  try {
    if (!url) {
      throw new Error("URL tidak valid");
    }

    // Ambil bagian setelah /upload/
    const uploadSplit = url.split("/upload/");

    if (uploadSplit.length < 2) {
      throw new Error("Format URL Cloudinary tidak valid");
    }

    let publicIdWithVersion = uploadSplit[1];

    // Hapus versi (v1234567890)
    publicIdWithVersion = publicIdWithVersion.replace(/^v\d+\//, "");

    // Hapus ekstensi file (.pdf, .jpg, dll)
    const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Gagal menghapus file dari Cloudinary:", error);
    throw error;
  }
}

/**
 * Update file di Cloudinary (hapus file lama, lalu upload baru)
 * @param {string} oldUrl - URL file lama yang ingin dihapus
 * @param {File} newFile - File baru yang akan diupload
 * @param {string} folder - Folder tempat file tersimpan (opsional)
 * @returns {Promise<string>} URL file yang baru diupload
 */
export async function updateCloudinaryFile(
  oldUrl: string,
  newFile: File,
  folder?: string,
) {
  try {
    await deleteFromCloudinary(oldUrl);
    return await uploadToCloudinary(newFile, folder);
  } catch (error) {
    throw new Error(`Gagal memperbarui file di Cloudinary: ${error}`);
  }
}
