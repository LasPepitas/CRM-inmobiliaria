import type { StateCreator } from 'zustand'
import type { Store } from '@/store'

export interface WhatsAppMessage {
  id: string
  text: string
  sender: 'agent' | 'client'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

export interface WhatsAppSlice {
  whatsappChats: Record<string, WhatsAppMessage[]>
  sendWhatsAppMessage: (leadId: string, text: string) => void
}

export const createWhatsAppSlice: StateCreator<Store, [], [], WhatsAppSlice> = (set) => ({
  whatsappChats: {
    '1': [
      { id: 'msg-1', text: '¡Hola Juan! Soy tu asesor de Grupo Siena. Vi que estuviste interesado en la casa en Palermo.', sender: 'agent', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'read' },
      { id: 'msg-2', text: 'Hola, sí, me gustaría saber si el precio es negociable.', sender: 'client', timestamp: new Date(Date.now() - 3000000).toISOString(), status: 'read' }
    ],
    '2': [
      { id: 'msg-3', text: 'María, ¿cómo estás? Te adjunto la información del departamento que visitamos.', sender: 'agent', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'read' }
    ]
  },
  sendWhatsAppMessage: (leadId, text) => set((state) => {
    const chat = state.whatsappChats[leadId] || []
    const newMsg: WhatsAppMessage = {
      id: String(Date.now()),
      text,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    return {
      whatsappChats: {
        ...state.whatsappChats,
        [leadId]: [...chat, newMsg]
      }
    }
  }),
})
