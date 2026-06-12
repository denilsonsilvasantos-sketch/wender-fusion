const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  crop?: string
  quality?: number
  format?: string
}) {
  if (!publicId) return ''
  if (publicId.startsWith('http')) return publicId

  const transforms: string[] = []
  if (options?.width) transforms.push(`w_${options.width}`)
  if (options?.height) transforms.push(`h_${options.height}`)
  if (options?.crop) transforms.push(`c_${options.crop}`)
  if (options?.quality) transforms.push(`q_${options.quality}`)
  if (options?.format) transforms.push(`f_${options.format}`)

  const transformStr = transforms.length > 0 ? transforms.join(',') + '/' : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`
}

export function getThumbnailUrl(publicId: string) {
  return getCloudinaryUrl(publicId, { width: 800, height: 450, crop: 'fill', quality: 80 })
}

export function getAvatarUrl(publicId: string, size = 100) {
  return getCloudinaryUrl(publicId, { width: size, height: size, crop: 'fill', quality: 80 })
}
