import multer from 'multer'
import type { Request } from 'express'

const storage = multer.memoryStorage()

const fileFilter = (type: 'image' | 'pdf' | 'any') => {
  return (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (type === 'image') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Apenas imagens são permitidas'))
      }
    } else if (type === 'pdf') {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Apenas PDFs são permitidos'))
      }
    }
    cb(null, true)
  }
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter('image'),
})

export const uploadPDF = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: fileFilter('pdf'),
})

export const uploadAny = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: fileFilter('any'),
})
