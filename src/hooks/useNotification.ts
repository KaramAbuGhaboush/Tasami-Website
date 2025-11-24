import { useToast } from '@/components/ui/toast'
import { useAlert } from '@/components/ui/alert-dialog'

/**
 * Unified notification hook that provides both toast and alert functionality
 * Use this instead of the native alert() function
 */
export function useNotification() {
  const { showToast } = useToast()
  const { showAlert } = useAlert()

  /**
   * Show a toast notification (non-blocking)
   */
  const toast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number) => {
    showToast(message, type, duration)
  }

  /**
   * Show a success toast
   */
  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  /**
   * Show an error toast
   */
  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  /**
   * Show a warning toast
   */
  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }

  /**
   * Show an info toast
   */
  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }

  /**
   * Show an alert dialog (blocking, returns a promise)
   * This is similar to window.confirm() but with better design
   */
  const confirm = async (
    message: string,
    options?: {
      title?: string
      type?: 'success' | 'error' | 'warning' | 'info'
      confirmText?: string
      cancelText?: string
      onConfirm?: () => void
      onCancel?: () => void
    }
  ): Promise<boolean> => {
    return showAlert(message, options?.type || 'info', {
      title: options?.title,
      confirmText: options?.confirmText || 'OK',
      cancelText: options?.cancelText || 'Cancel',
      showCancel: true,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel
    })
  }

  /**
   * Show a simple alert dialog (non-blocking in terms of promise, but blocking UI)
   * This is similar to window.alert() but with better design
   */
  const alert = async (
    message: string,
    options?: {
      title?: string
      type?: 'success' | 'error' | 'warning' | 'info'
      confirmText?: string
      onConfirm?: () => void
    }
  ): Promise<void> => {
    await showAlert(message, options?.type || 'info', {
      title: options?.title,
      confirmText: options?.confirmText || 'OK',
      showCancel: false,
      onConfirm: options?.onConfirm
    })
  }

  return {
    toast,
    success,
    error,
    warning,
    info,
    confirm,
    alert
  }
}

