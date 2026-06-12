import { Router } from 'express'
import type { Response, NextFunction } from 'express'
import { authenticate, type AuthRequest } from '../middleware/auth'
import { uploadImage, uploadPDF } from '../middleware/upload'
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary'
import { supabase } from '../config/supabase'

const router = Router()

// POST /api/upload/image - upload generic image
router.post('/image', authenticate, uploadImage.single('file'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado' })
    const folder = req.body.folder || 'general'
    const result = await uploadToCloudinary(req.file.buffer, `wf/${folder}`)
    res.json({ public_id: result.public_id, url: result.secure_url })
  } catch (err) { next(err) }
})

// POST /api/upload/pdf - upload PDF material
router.post('/pdf', authenticate, uploadPDF.single('file'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado' })
    const folder = req.body.folder || 'materials'
    const result = await uploadToCloudinary(req.file.buffer, `wf/${folder}`, undefined, 'raw')
    res.json({ public_id: result.public_id, url: result.secure_url })
  } catch (err) { next(err) }
})

// POST /api/users/avatar - upload avatar
router.post('/avatar', authenticate, uploadImage.single('avatar'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado' })

    // Delete old avatar if exists
    const { data: profile } = await supabase.from('user_profiles').select('avatar_url').eq('id', req.userId!).single()
    if (profile?.avatar_url && !profile.avatar_url.startsWith('http')) {
      await deleteFromCloudinary(profile.avatar_url)
    }

    const result = await uploadToCloudinary(req.file.buffer, 'wf/avatars', `avatar_${req.userId}`)
    await supabase.from('user_profiles').update({ avatar_url: result.public_id }).eq('id', req.userId!)
    res.json({ avatar_url: result.public_id, url: result.secure_url })
  } catch (err) { next(err) }
})

export default router
