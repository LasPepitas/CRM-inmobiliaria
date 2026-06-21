import { useState, useRef, useEffect, useMemo } from 'react'
import { useStore } from '@/store'

export function useWhatsApp() {
  const { leads, whatsappChats, sendWhatsAppMessage } = useStore()

  const [search, setSearch] = useState('')
  const [activeLead, setActiveLead] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeLeadData = useMemo(
    () => leads.find(l => l.id === activeLead),
    [leads, activeLead]
  )

  const activeChat = useMemo(
    () => (activeLead ? whatsappChats[activeLead] || [] : []),
    [activeLead, whatsappChats]
  )

  const chatList = useMemo(
    () => leads
      .filter(l => !!l.phone && `${l.firstName} ${l.lastName}`.trim().toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const chatA = whatsappChats[a.id]
        const chatB = whatsappChats[b.id]
        const lastA = chatA?.length ? new Date(chatA[chatA.length - 1].timestamp).getTime() : 0
        const lastB = chatB?.length ? new Date(chatB[chatB.length - 1].timestamp).getTime() : 0
        return lastB - lastA
      }),
    [leads, whatsappChats, search]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat])

  const handleSend = () => {
    if (!message.trim() || !activeLead) return
    sendWhatsAppMessage(activeLead, message.trim())
    setMessage('')
    setShowTemplates(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertTemplate = (text: string) => {
    setMessage(text)
    setShowTemplates(false)
  }

  return {
    leads,
    whatsappChats,
    chatList,
    activeLead,
    activeLeadData,
    activeChat,
    search,
    message,
    showTemplates,
    messagesEndRef,
    setSearch,
    setActiveLead,
    setMessage,
    setShowTemplates,
    handleSend,
    handleKeyPress,
    insertTemplate,
  }
}
