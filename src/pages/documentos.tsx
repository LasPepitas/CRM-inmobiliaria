import { useState } from 'react'
import { useStore } from '@/store'
import type { Document } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Eye,
  Download,
  Send,
  Trash2,
  Plus,
  CheckCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

const typeOptions = ['Contrato', 'Escritura', 'Plano', 'Título', 'Avalúo'] as const
type DocType = typeof typeOptions[number]
const statusOptions = ['Borrador', 'Enviado', 'Firmado', 'Expirado'] as const
type DocStatus = typeof statusOptions[number]

const typeIcons: Record<DocType, string> = {
  'Contrato': '📄',
  'Escritura': '📜',
  'Plano': '🗺️',
  'Título': '📋',
  'Avalúo': '💰',
}

const statusVariants: Record<DocStatus, 'default' | 'success' | 'warning' | 'error' | 'outline'> = {
  'Borrador': 'outline',
  'Enviado': 'warning',
  'Firmado': 'success',
  'Expirado': 'error',
}

export function DocumentosPage() {
  const { documents, properties, leads, addDocument, updateDocument, deleteDocument, sendDocument, addToast } = useStore()
  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'Contrato' as Document['type'],
    property_id: '1',
    lead_id: '',
    status: 'Borrador' as Document['status'],
  })

  const selectedDocData = documents.find(d => d.id === selectedDoc)

  const getPropertyTitle = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.title || 'Propiedad'
  }

  const getLeadName = (leadId?: string) => {
    if (!leadId) return '-'
    return leads.find(l => l.id === leadId)?.name || '-'
  }

  const handleAddDocument = () => {
    if (!newDoc.name) {
      addToast({ title: 'Error', description: 'Completá el nombre del documento', variant: 'error' })
      return
    }
    addDocument({
      ...newDoc,
      updated_at: new Date().toISOString().split('T')[0],
    })
    addToast({ title: 'Documento creado', description: `${newDoc.name} fue agregado`, variant: 'success' })
    setShowNewDocModal(false)
    setNewDoc({ name: '', type: 'Contrato', property_id: '1', lead_id: '', status: 'Borrador' })
  }

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    deleteDocument(id)
    addToast({ title: 'Documento eliminado', description: `${doc?.name} fue eliminado`, variant: 'success' })
    setDeleteConfirm(null)
  }

  const handleSendDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    sendDocument(id)
    addToast({ title: 'Documento enviado', description: `${doc?.name} fue marcado como enviado`, variant: 'success' })
  }

  const handleSignDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    updateDocument(id, { status: 'Firmado', updated_at: new Date().toISOString().split('T')[0] })
    addToast({ title: 'Documento firmado', description: `${doc?.name} fue firmado`, variant: 'success' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Documentos</h1>
          <p className="text-neutral-600 mt-1">{documents.length} documentos en gestión</p>
        </div>
        <Button onClick={() => setShowNewDocModal(true)}>
          <Plus className="h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center text-xl">
                        {typeIcons[doc.type] || '📄'}
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                  <TableCell className="text-neutral-600">{getPropertyTitle(doc.property_id)}</TableCell>
                  <TableCell className="text-neutral-600">{getLeadName(doc.lead_id)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[doc.status]}>{doc.status}</Badge>
                  </TableCell>
                  <TableCell className="text-neutral-600">{formatDate(doc.updated_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDoc(doc.id)}><Eye className="h-4 w-4 mr-2" />Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addToast({ title: 'Descargando...', description: `${doc.name}`, variant: 'default' })}><Download className="h-4 w-4 mr-2" />Descargar</DropdownMenuItem>
                        {doc.status === 'Borrador' && (
                          <DropdownMenuItem onClick={() => handleSendDocument(doc.id)}><Send className="h-4 w-4 mr-2" />Enviar</DropdownMenuItem>
                        )}
                        {doc.status === 'Enviado' && (
                          <DropdownMenuItem onClick={() => handleSignDocument(doc.id)}><CheckCircle className="h-4 w-4 mr-2" />Marcar Firmado</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeleteConfirm(doc.id)} className="text-error-500"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-lg">
          {selectedDocData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocData.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Tipo</p>
                    <Badge variant="outline">{selectedDocData.type}</Badge>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-1">Estado</p>
                    <Badge variant={statusVariants[selectedDocData.status]}>{selectedDocData.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-neutral-500 mb-1">Propiedad</p>
                  <p className="font-medium">{getPropertyTitle(selectedDocData.property_id)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-neutral-500 mb-1">Lead</p>
                  <p className="font-medium">{getLeadName(selectedDocData.lead_id)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-neutral-500 mb-1">Última Actualización</p>
                  <p className="font-medium">{formatDate(selectedDocData.updated_at)}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => addToast({ title: 'Descargando...', description: `${selectedDocData.name}`, variant: 'default' })}><Download className="h-4 w-4 mr-2" />Descargar</Button>
                  {selectedDocData.status === 'Borrador' && (
                    <Button className="flex-1" onClick={() => { handleSendDocument(selectedDocData.id); setSelectedDoc(null); }}><Send className="h-4 w-4 mr-2" />Enviar</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Document Dialog */}
      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Documento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre del Documento *</label>
              <input className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" placeholder="Ej: Contrato de compraventa" value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as Document['type'] })}>
                  <option value="Contrato">Contrato</option>
                  <option value="Escritura">Escritura</option>
                  <option value="Plano">Plano</option>
                  <option value="Título">Título</option>
                  <option value="Avalúo">Avalúo</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Propiedad</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newDoc.property_id} onChange={(e) => setNewDoc({ ...newDoc, property_id: e.target.value })}>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lead (opcional)</label>
              <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" value={newDoc.lead_id} onChange={(e) => setNewDoc({ ...newDoc, lead_id: e.target.value })}>
                <option value="">Sin lead vinculado</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocModal(false)}>Cancelar</Button>
            <Button onClick={handleAddDocument}><Plus className="h-4 w-4 mr-2" />Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>¿Eliminar documento?</DialogTitle></DialogHeader>
          <p className="text-neutral-600 py-4">Esta acción no se puede deshacer. El documento será eliminado permanentemente.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteDocument(deleteConfirm)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
