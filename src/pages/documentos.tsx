import { useState } from 'react'
import { useStore } from '@/store'
import type { Document } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Download,
  Send,
  Trash2,
  Plus,
  CheckCircle,
  Search,
  SlidersHorizontal,
  FileSignature,
  Printer,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

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
  const { documents, properties, leads, deals, addDocument, updateDocument, deleteDocument, sendDocument, addToast } = useStore()
  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [showWizardModal, setShowWizardModal] = useState(false)
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'Contrato' as Document['type'],
    property_id: '',
    lead_id: '',
    status: 'Borrador' as Document['status'],
  })

  // Contract Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState({
    lead_id: '',
    deal_id: '',
    property_id: '',
    type: 'compra' as 'compra' | 'alquiler',
  })

  // Document Filters
  const [typeFilterDoc, setTypeFilterDoc] = useState<string>('')
  const [statusFilterDoc, setStatusFilterDoc] = useState<string>('')
  const [docSearch, setDocSearch] = useState('')

  const getPropertyTitle = (propertyId: string) => properties.find(p => p.id === propertyId)?.title || 'Propiedad'
  const getLeadName = (leadId?: string) => leads.find(l => l.id === leadId)?.name || '-'

  const filteredDocuments = documents.filter(doc => {
    const matchesType = !typeFilterDoc || doc.type === typeFilterDoc
    const matchesStatus = !statusFilterDoc || doc.status === statusFilterDoc
    const matchesSearch = !docSearch ||
      doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      getPropertyTitle(doc.property_id).toLowerCase().includes(docSearch.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })
  const activeDocFilters = [typeFilterDoc, statusFilterDoc, docSearch].filter(Boolean).length

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
    setNewDoc({ name: '', type: 'Contrato', property_id: '', lead_id: '', status: 'Borrador' })
  }

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id)
    deleteDocument(id)
    addToast({ title: 'Documento eliminado', description: `${doc?.name} fue eliminado`, variant: 'success' })
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

  // Contract Wizard Logic
  const selectedLead = leads.find(l => l.id === wizardData.lead_id)
  const selectedDeal = deals.find(d => d.id === wizardData.deal_id)
  const selectedProp = properties.find(p => p.id === wizardData.property_id) || properties.find(p => p.id === selectedDeal?.property_id)
  const leadDeals = deals.filter(d => d.lead_id === wizardData.lead_id)

  const handlePrint = () => {
    window.print()
  }

  const handleFinishWizard = () => {
    addDocument({
      name: `Contrato de ${wizardData.type === 'compra' ? 'Compraventa' : 'Alquiler'} - ${selectedLead?.name}`,
      type: 'Contrato',
      property_id: selectedProp?.id || '1',
      lead_id: selectedLead?.id,
      status: 'Borrador',
      updated_at: new Date().toISOString().split('T')[0],
    })
    addToast({ title: 'Contrato generado', description: 'El contrato se guardó en borradores', variant: 'success' })
    setShowWizardModal(false)
    setWizardStep(1)
    setWizardData({ lead_id: '', deal_id: '', property_id: '', type: 'compra' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Documentos</h1>
          <p className="text-neutral-600 mt-1">{documents.length} documentos en gestión</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowWizardModal(true)}>
            <FileSignature className="h-4 w-4 mr-2" />
            Generar Contrato
          </Button>
          <Button onClick={() => setShowNewDocModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Subir Documento
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardContent className="p-4 border-b border-outline-variant/50">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Buscar documentos..."
                className="pl-9"
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
              <select
                className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
                value={typeFilterDoc}
                onChange={e => setTypeFilterDoc(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm"
                value={statusFilterDoc}
                onChange={e => setStatusFilterDoc(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {activeDocFilters > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setTypeFilterDoc(''); setStatusFilterDoc(''); setDocSearch('') }}
                  className="text-error-500 border-error-500/30 hover:bg-error-500/5"
                >
                  Limpiar ({activeDocFilters})
                </Button>
              )}
              <span className="text-sm text-neutral-500 ml-auto">{filteredDocuments.length} docs</span>
            </div>
          </div>
        </CardContent>
        <CardContent className="p-6 pt-0">
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
              {filteredDocuments.map((doc) => (
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
                        <DropdownMenuItem onClick={() => addToast({ title: 'Descargando...', description: `${doc.name}`, variant: 'default' })}><Download className="h-4 w-4 mr-2" />Descargar</DropdownMenuItem>
                        {doc.status === 'Borrador' && (
                          <DropdownMenuItem onClick={() => handleSendDocument(doc.id)}><Send className="h-4 w-4 mr-2" />Enviar</DropdownMenuItem>
                        )}
                        {doc.status === 'Enviado' && (
                          <DropdownMenuItem onClick={() => handleSignDocument(doc.id)}><CheckCircle className="h-4 w-4 mr-2" />Marcar Firmado</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)} className="text-error-500"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDocuments.length === 0 && (
                <tr><TableCell colSpan={7} className="h-32 text-center text-neutral-400">No hay documentos que coincidan con los filtros</TableCell></tr>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Document Dialog */}
      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Subir Documento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre del Documento *</label>
              <input className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1" placeholder="Ej: Plano arquitectónico" value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1" value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as Document['type'] })}>
                  <option value="Contrato">Contrato</option>
                  <option value="Escritura">Escritura</option>
                  <option value="Plano">Plano</option>
                  <option value="Título">Título</option>
                  <option value="Avalúo">Avalúo</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Propiedad *</label>
                <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1" value={newDoc.property_id} onChange={(e) => setNewDoc({ ...newDoc, property_id: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lead (opcional)</label>
              <select className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1" value={newDoc.lead_id} onChange={(e) => setNewDoc({ ...newDoc, lead_id: e.target.value })}>
                <option value="">Sin lead vinculado</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocModal(false)}>Cancelar</Button>
            <Button onClick={handleAddDocument}><Plus className="h-4 w-4 mr-2" />Subir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Wizard Dialog */}
      <Dialog open={showWizardModal} onOpenChange={setShowWizardModal}>
        <DialogContent className={wizardStep === 3 ? "max-w-4xl max-h-[90vh] overflow-y-auto" : "max-w-lg"}>
          <DialogHeader>
            <DialogTitle>Generador de Contratos</DialogTitle>
          </DialogHeader>
          
          {wizardStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="flex gap-2 mb-6">
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
                <div className="flex-1 h-1.5 rounded-full bg-neutral-100" />
                <div className="flex-1 h-1.5 rounded-full bg-neutral-100" />
              </div>
              <h3 className="font-semibold text-lg">Paso 1: Seleccionar Cliente</h3>
              <div>
                <label className="text-sm font-medium">Cliente (Lead) *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                  value={wizardData.lead_id}
                  onChange={(e) => setWizardData({ ...wizardData, lead_id: e.target.value })}
                >
                  <option value="">Seleccionar lead...</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name} — {l.email}</option>)}
                </select>
              </div>
              {selectedLead && (
                <div className="bg-neutral-50 p-4 rounded-lg mt-4 text-sm">
                  <p><strong>Datos encontrados:</strong></p>
                  <p>Teléfono: {selectedLead.phone}</p>
                  <p>Email: {selectedLead.email}</p>
                  {selectedLead.payment_config && (
                    <p>Pago: {selectedLead.payment_config.type}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="flex gap-2 mb-6">
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
                <div className="flex-1 h-1.5 rounded-full bg-neutral-100" />
              </div>
              <h3 className="font-semibold text-lg">Paso 2: Operación y Propiedad</h3>
              <div>
                <label className="text-sm font-medium">Tipo de Operación</label>
                <select
                  className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                  value={wizardData.type}
                  onChange={(e) => setWizardData({ ...wizardData, type: e.target.value as any })}
                >
                  <option value="compra">Compraventa</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Negocio vinculado (Opcional)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                  value={wizardData.deal_id}
                  onChange={(e) => {
                    const deal = deals.find(d => d.id === e.target.value)
                    setWizardData({ ...wizardData, deal_id: e.target.value, property_id: deal?.property_id || wizardData.property_id })
                  }}
                >
                  <option value="">Sin negocio específico</option>
                  {leadDeals.map(d => <option key={d.id} value={d.id}>{d.title} ({formatCurrency(d.value)})</option>)}
                </select>
              </div>
              {!wizardData.deal_id && (
                <div>
                  <label className="text-sm font-medium">Propiedad *</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm mt-1"
                    value={wizardData.property_id}
                    onChange={(e) => setWizardData({ ...wizardData, property_id: e.target.value })}
                  >
                    <option value="">Seleccionar propiedad...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4 py-4 print:py-0 print:absolute print:inset-0 print:bg-white print:z-50 print:block">
              <div className="flex gap-2 mb-6 print:hidden">
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
                <div className="flex-1 h-1.5 rounded-full bg-primary" />
              </div>
              
              <div className="print:hidden flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Paso 3: Vista Previa</h3>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir / PDF
                </Button>
              </div>

              {/* Preview del Contrato */}
              <div className="border border-neutral-200 p-8 md:p-12 bg-white text-black font-serif text-justify print:border-none print:p-0 print:m-0 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm print:shadow-none">
                <div className="flex justify-between items-start mb-12">
                  <img src="/logo.png" alt="Grupo Siena" className="h-16 object-contain" />
                  <div className="text-right text-sm text-gray-500 font-sans">
                    <p>CONTRATO DE {wizardData.type.toUpperCase()}</p>
                    <p>Nº Ref: DOC-{Date.now().toString().slice(-6)}</p>
                    <p>Fecha: {new Date().toLocaleDateString('es-AR')}</p>
                  </div>
                </div>

                <h1 className="text-xl font-bold text-center mb-8 uppercase underline decoration-double underline-offset-4">
                  CONTRATO DE {wizardData.type === 'compra' ? 'COMPRAVENTA' : 'ARRENDAMIENTO'} INMOBILIARIO
                </h1>

                <div className="space-y-6 text-sm leading-relaxed">
                  <p>
                    Entre <strong>GRUPO SIENA INMOBILIARIA</strong>, en adelante EL {wizardData.type === 'compra' ? 'VENDEDOR' : 'LOCADOR'}, 
                    y por la otra parte <strong>{selectedLead?.name?.toUpperCase()}</strong>, con DNI ________________, 
                    email: {selectedLead?.email}, teléfono: {selectedLead?.phone}, en adelante EL {wizardData.type === 'compra' ? 'COMPRADOR' : 'LOCATARIO'}, 
                    se conviene celebrar el presente contrato sujeto a las siguientes cláusulas:
                  </p>

                  <p>
                    <strong>PRIMERA (OBJETO):</strong> EL {wizardData.type === 'compra' ? 'VENDEDOR' : 'LOCADOR'} entrega 
                    al {wizardData.type === 'compra' ? 'COMPRADOR' : 'LOCATARIO'} el inmueble tipo <strong>{selectedProp?.type}</strong>, 
                    ubicado en la ciudad de <strong>{selectedProp?.city}</strong>, barrio <strong>{selectedProp?.neighborhood}</strong>, 
                    con una superficie de {selectedProp?.area_m2} m².
                  </p>

                  <p>
                    <strong>SEGUNDA (PRECIO Y FORMA DE PAGO):</strong> El precio convenido por la operación se fija en la suma de 
                    <strong> {formatCurrency(selectedDeal?.value || selectedProp?.price || 0)}</strong>. 
                    {selectedLead?.payment_config?.type === 'cuotas' ? (
                      ` La operación se realizará en cuotas, con un anticipo de ${formatCurrency(selectedLead.payment_config.down_payment || 0)} y el resto en ${selectedLead.payment_config.installments} cuotas.`
                    ) : selectedLead?.payment_config?.type === 'hipoteca' ? (
                      ` La operación se realizará mediante crédito hipotecario del banco ${selectedLead.payment_config.bank}.`
                    ) : (
                      " La operación se realizará al contado en su totalidad."
                    )}
                  </p>

                  <p>
                    <strong>TERCERA (CONDICIONES):</strong> El inmueble se entrega en el estado en que se encuentra, libre de ocupantes
                    y con los impuestos al día. Las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad
                    para cualquier divergencia originada en el presente contrato.
                  </p>

                  <div className="pt-24 flex justify-between px-12">
                    <div className="text-center">
                      <div className="border-t border-black w-48 mb-2"></div>
                      <p className="font-bold">GRUPO SIENA</p>
                      <p className="text-xs">Representante Legal</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-black w-48 mb-2"></div>
                      <p className="font-bold">{selectedLead?.name?.toUpperCase()}</p>
                      <p className="text-xs">DNI: ________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="print:hidden mt-4">
            {wizardStep > 1 && (
              <Button variant="outline" onClick={() => setWizardStep(s => s - 1)}>Atrás</Button>
            )}
            {wizardStep < 3 ? (
              <Button 
                onClick={() => setWizardStep(s => s + 1)}
                disabled={(wizardStep === 1 && !wizardData.lead_id) || (wizardStep === 2 && !wizardData.property_id && !wizardData.deal_id)}
              >
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleFinishWizard}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Guardar Contrato
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
