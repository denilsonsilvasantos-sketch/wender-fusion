import type { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  code?: string
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export function createError(message: string, statusCode = 500): AppError {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  return error
}
