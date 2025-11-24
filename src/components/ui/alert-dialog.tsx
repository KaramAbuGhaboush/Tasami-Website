'use client'

import * as React from 'react'
import { AlertTriangle, CheckCircle, Info, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface AlertDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  message: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

export function AlertDialog({
  open,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false
}: AlertDialogProps) {
  if (!open) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        }
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
    }
  }

  const styles = getStyles()
  const Icon = styles.icon

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          'bg-white rounded-xl shadow-2xl max-w-md w-full border-2 transform transition-all',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          styles.borderColor
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn('p-6', styles.bgColor)}>
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0', styles.iconColor)}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
              )}
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-white flex items-center justify-end gap-3 rounded-b-xl">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
              styles.buttonColor
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Alert context for managing alert dialogs globally
interface AlertContextType {
  showAlert: (
    message: string,
    type?: AlertType,
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      onConfirm?: () => void
      onCancel?: () => void
      showCancel?: boolean
    }
  ) => Promise<boolean>
}

const AlertContext = React.createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = React.useState<{
    open: boolean
    message: string
    type: AlertType
    title?: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    showCancel?: boolean
    resolve?: (value: boolean) => void
  }>({
    open: false,
    message: '',
    type: 'info'
  })

  const showAlert = React.useCallback((
    message: string,
    type: AlertType = 'info',
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      onConfirm?: () => void
      onCancel?: () => void
      showCancel?: boolean
    }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({
        open: true,
        message,
        type,
        title: options?.title,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
        onConfirm: options?.onConfirm,
        onCancel: options?.onCancel,
        showCancel: options?.showCancel ?? false,
        resolve
      })
    })
  }, [])

  const handleClose = () => {
    if (alertState.resolve) {
      alertState.resolve(false)
    }
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  const handleConfirm = () => {
    if (alertState.onConfirm) {
      alertState.onConfirm()
    }
    if (alertState.resolve) {
      alertState.resolve(true)
    }
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  const handleCancel = () => {
    if (alertState.onCancel) {
      alertState.onCancel()
    }
    if (alertState.resolve) {
      alertState.resolve(false)
    }
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog
        open={alertState.open}
        onClose={handleClose}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        showCancel={alertState.showCancel}
      />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = React.useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}

