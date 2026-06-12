import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<{ public_id: string; secure_url: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id, resource_type: resourceType, overwrite: true },
      (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'))
        else resolve({ public_id: result.public_id, secure_url: result.secure_url })
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'raw' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
