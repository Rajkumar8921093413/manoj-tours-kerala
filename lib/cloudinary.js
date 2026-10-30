import { v2 as cloudinary } from 'cloudinary';

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export function isCloudinaryConfigured() {
  return isConfigured;
}

/**
 * Upload a file Buffer directly to Cloudinary.
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Subfolder name e.g. 'rooms', 'safaris', 'packages'
 * @param {string} publicId - Optional custom filename without extension
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export async function uploadToCloudinary(buffer, folder = 'uploads', publicId = null) {
  if (!isConfigured) {
    throw new Error('Cloudinary environment variables not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `manoj_tours/${folder}`,
      resource_type: 'image'
    };
    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      });
    });

    uploadStream.end(buffer);
  });
}

/**
 * Extract public_id from Cloudinary URL:
 * e.g. "https://res.cloudinary.com/wi0jxxkm/image/upload/v1793353362/manoj_tours/test/xyz.png" -> "manoj_tours/test/xyz"
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary.com')) return null;

  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    console.error('Failed to parse Cloudinary URL for public_id:', e);
  }
  return null;
}

/**
 * Delete an image from Cloudinary by its public_id or its full secure_url
 * @param {string} publicIdOrUrl
 * @returns {Promise<{ result: string }>}
 */
export async function deleteFromCloudinary(publicIdOrUrl) {
  if (!isConfigured || !publicIdOrUrl) {
    return { result: 'skipped' };
  }

  const publicId = publicIdOrUrl.startsWith('http')
    ? extractPublicIdFromUrl(publicIdOrUrl)
    : publicIdOrUrl;

  if (!publicId) {
    return { result: 'invalid_id' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error('Cloudinary destroy error:', err);
    return { error: err.message };
  }
}

export default {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
};

