import { useState } from 'react'

interface ToastState {
  open: boolean
  title: string
  description: string
  variant: 'default' | 'destructive'
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
  })

  const showToast = (newToast: Omit<ToastState, 'open'>) => {
    setToast({ ...newToast, open: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }))
  }

  return { toast, showToast, hideToast }
}
