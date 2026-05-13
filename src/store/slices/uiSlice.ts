import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface UIState {
  sidebarCollapsed: boolean
  activePage: string
  selectedProperty: string | null
  darkMode: boolean
  modals: {
    newLead: boolean
    addProperty: boolean
    scheduleVisit: boolean
    confirmDelete: boolean
  }
}

export interface ToastState {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

export interface UISlice {
  ui: UIState
  toasts: ToastState[]
  toggleSidebar: () => void
  setActivePage: (page: string) => void
  setSelectedProperty: (id: string | null) => void
  toggleDarkMode: () => void
  openModal: (modal: keyof UIState['modals']) => void
  closeModal: (modal: keyof UIState['modals']) => void
  addToast: (toast: Omit<ToastState, 'id'>) => void
  removeToast: (id: string) => void
}

export const createUISlice: StateCreator<Store, [], [], UISlice> = (set, get) => ({
  ui: {
    sidebarCollapsed: false,
    activePage: 'overview',
    selectedProperty: null,
    darkMode: false,
    modals: {
      newLead: false,
      addProperty: false,
      scheduleVisit: false,
      confirmDelete: false,
    },
  },
  toasts: [],
  toggleSidebar: () => set((state) => ({
    ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
  })),
  setActivePage: (page) => set((state) => ({
    ui: { ...state.ui, activePage: page }
  })),
  setSelectedProperty: (id) => set((state) => ({
    ui: { ...state.ui, selectedProperty: id }
  })),
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.ui.darkMode
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { ui: { ...state.ui, darkMode: newDarkMode } }
  }),
  openModal: (modal) => set((state) => ({
    ui: { ...state.ui, modals: { ...state.ui.modals, [modal]: true } }
  })),
  closeModal: (modal) => set((state) => ({
    ui: { ...state.ui, modals: { ...state.ui.modals, [modal]: false } }
  })),
  addToast: (toast) => set((state) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    // Using setTimeout inside a set is generally an anti-pattern in React/Zustand, 
    // but preserving original behavior for now.
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
    return { toasts: [...state.toasts, newToast] }
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
})
