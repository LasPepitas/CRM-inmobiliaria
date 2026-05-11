import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/store'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Zap,
} from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'

const templates = [
  { id: 't1', title: 'Primer contacto', text: '¡Hola! Soy tu asesor de Grupo Siena. Vi que estuviste interesado en una de nuestras propiedades. ¿En qué horario te viene bien que hablemos?' },
  { id: 't2', title: 'Recordatorio visita', text: 'Te escribo para recordarte nuestra visita programada para mañana. Por favor confirmame si seguís disponible.' },
  { id: 't3', title: 'Seguimiento', text: 'Quería consultarte qué te pareció la propiedad que visitamos. Si tenés alguna duda, estoy a tu disposición.' },
  { id: 't4', title: 'Documentación', text: 'Te envié al correo el borrador del contrato para que lo revises. Avisame cuando lo hayas leído.' },
]

export function WhatsAppPage() {
  const { leads, whatsappChats, sendWhatsAppMessage } = useStore()
  const [search, setSearch] = useState('')
  const [activeLead, setActiveLead] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeLeadData = leads.find(l => l.id === activeLead)
  const activeChat = activeLead ? whatsappChats[activeLead] || [] : []

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeChat])

  // Lista de chats filtrada (leads con número de teléfono o los que ya tienen chat)
  const chatList = leads.filter(l => {
    const hasPhone = !!l.phone
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase())
    return hasPhone && matchesSearch
  }).sort((a, b) => {
    const chatA = whatsappChats[a.id]
    const chatB = whatsappChats[b.id]
    const lastA = chatA?.length ? new Date(chatA[chatA.length - 1].timestamp).getTime() : 0
    const lastB = chatB?.length ? new Date(chatB[chatB.length - 1].timestamp).getTime() : 0
    return lastB - lastA // Ordenar por mensaje más reciente
  })

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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-heading">WhatsApp</h1>
        <p className="text-neutral-600 mt-1">Gestión de comunicaciones con clientes</p>
      </div>

      <Card className="flex-1 overflow-hidden flex border-outline-variant/50 shadow-sm">
        {/* Panel izquierdo: Lista de chats */}
        <div className="w-80 border-r border-outline-variant/50 flex flex-col bg-surface-container-lowest">
          <div className="p-4 border-b border-outline-variant/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-9 h-9 bg-neutral-100 border-transparent focus-visible:ring-primary/20"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatList.map((lead) => {
              const chat = whatsappChats[lead.id] || []
              const lastMessage = chat.length > 0 ? chat[chat.length - 1] : null
              const isActive = activeLead === lead.id
              
              return (
                <button
                  key={lead.id}
                  onClick={() => setActiveLead(lead.id)}
                  className={cn(
                    "w-full p-3 flex items-start gap-3 border-b border-outline-variant/50 transition-colors text-left",
                    isActive ? "bg-primary/5" : "hover:bg-neutral-50"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className={isActive ? "bg-primary text-white" : "bg-neutral-200"}>
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-semibold text-sm truncate">{lead.name}</span>
                      {lastMessage && (
                        <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                          {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {lastMessage ? (
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        {lastMessage.sender === 'agent' && (
                          <CheckCheck className={cn("h-3 w-3", lastMessage.status === 'read' ? 'text-primary' : 'text-neutral-400')} />
                        )}
                        <span className="truncate">{lastMessage.text}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">Sin mensajes</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel derecho: Conversación */}
        <div className="flex-1 flex flex-col bg-[#efeae2]">
          {activeLeadData ? (
            <>
              {/* Header de la conversación */}
              <div className="h-16 px-4 flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/50 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">{getInitials(activeLeadData.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold leading-none">{activeLeadData.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-500">{activeLeadData.phone}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{activeLeadData.stage}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-neutral-500"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-neutral-500"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-neutral-500"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center mb-6">
                  <span className="text-xs font-medium bg-neutral-200/50 text-neutral-600 px-3 py-1 rounded-lg">
                    Hoy
                  </span>
                </div>
                
                {activeChat.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-500 opacity-60">
                    <MessageCircle className="h-12 w-12 mb-3" />
                    <p>Iniciá la conversación con {activeLeadData.name}</p>
                  </div>
                ) : (
                  activeChat.map((msg) => {
                    const isAgent = msg.sender === 'agent'
                    return (
                      <div key={msg.id} className={cn("flex", isAgent ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-3 py-2 shadow-sm relative text-sm",
                            isAgent ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
                          )}
                        >
                          <p className="text-neutral-900 break-words">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-neutral-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isAgent && (
                              <CheckCheck className={cn("h-3 w-3", msg.status === 'read' ? 'text-[#53bdeb]' : 'text-neutral-400')} />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Templates Popover (simplificado) */}
              {showTemplates && (
                <div className="px-4 pb-2">
                  <div className="bg-white border border-outline-variant/50 rounded-xl shadow-lg p-2 flex gap-2 overflow-x-auto">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => insertTemplate(t.text)}
                        className="shrink-0 bg-neutral-50 hover:bg-primary/5 border border-outline-variant/50 rounded-lg p-2 text-left w-48 transition-colors"
                      >
                        <p className="text-xs font-semibold text-primary mb-1">{t.title}</p>
                        <p className="text-[10px] text-neutral-500 line-clamp-2">{t.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input de mensaje */}
              <div className="p-3 bg-surface-container-lowest flex items-end gap-2 border-t border-outline-variant/50 shrink-0 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("shrink-0", showTemplates ? "text-primary bg-primary/10" : "text-neutral-500")}
                  onClick={() => setShowTemplates(!showTemplates)}
                  title="Respuestas rápidas"
                >
                  <Zap className="h-5 w-5" />
                </Button>
                
                <textarea
                  className="flex-1 min-h-[40px] max-h-32 bg-white border border-outline-variant/50 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Escribe un mensaje..."
                  rows={1}
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  onKeyDown={handleKeyPress}
                />
                
                <Button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="shrink-0 h-10 w-10 rounded-full"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 bg-surface-container-lowest">
              <MessageCircle className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-neutral-500">Seleccioná un chat para comenzar</p>
              <p className="text-sm">Solo aparecen los leads que tienen número de teléfono</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
