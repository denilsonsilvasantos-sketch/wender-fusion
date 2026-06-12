import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#000' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </StrictMode>
)
