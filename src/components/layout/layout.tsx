import { useStore } from '@/store'
import { Layout as LayoutBase } from './index'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <LayoutBase>
      {children}
      <ToastContainer />
    </LayoutBase>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
            toast.variant === 'success' && "bg-success-500 border-success-500 text-white",
            toast.variant === 'error' && "bg-error-500 border-error-500 text-white",
            toast.variant !== 'success' && toast.variant !== 'error' && "bg-surface-container-lowest border-outline-variant"
          )}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && (
              <p className={cn("text-xs mt-1 break-words", toast.variant === 'success' || toast.variant === 'error' ? 'text-white/80' : 'text-neutral-600')}>
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={cn("shrink-0", toast.variant === 'success' || toast.variant === 'error' ? "text-white/60 hover:text-white" : "text-neutral-500 hover:text-neutral-800")}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}