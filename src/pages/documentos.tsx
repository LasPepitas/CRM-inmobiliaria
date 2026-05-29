import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  MoreVertical, Download, Send, Trash2, Plus, CheckCircle,
  Search, SlidersHorizontal, FileSignature, Printer,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { DOC_TYPES, DOC_STATUSES, typeIcons, statusVariants } from '@/features/documentos/constants'
import { useDocumentos } from '@/features/documentos'

export function DocumentosPage() {
  const {
    documents,
    properties,
    leads,
    deals,
    filteredDocuments,
    activeFilters,
    isLoading,
    showNewDocModal,
    newDoc,
    setShowNewDocModal,
    setNewDoc,
    typeFilter,
    statusFilter,
    docSearch,
    setTypeFilter,
    setStatusFilter,
    setDocSearch,
    clearFilters,
    showWizardModal,
    wizardStep,
    wizardData,
    selectedLead,
    selectedDeal,
    selectedProp,
    leadDeals,
    docRef,
    currentDate,
    setShowWizardModal,
    setWizardStep,
    setWizardData,
    getPropertyTitle,
    getLeadName,
    handleAddDocument,
    handleDownloadDocument,
    handleDeleteDocument,
    handleSendDocument,
    handleSignDocument,
    handleFinishWizard,
    handlePrint,
    fetchDocuments,
  } = useDocumentos()

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Documentos</h1>
          <p className="text-neutral-600 mt-1">{isLoading ? 'Cargando...' : `${documents.length} documentos en gestión`}</p>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          <Button variant="outline" onClick={() => setShowWizardModal(true)}>
            <FileSignature className="h-4 w-4 mr-2" /> Generar Contrato
          </Button>
          <Button id="upload-doc-btn" onClick={() => setShowNewDocModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Subir Documento
          </Button>
        </div>
      </div>

      {/* Filter + Table */}
      <Card className="print:hidden">
        <CardContent className="p-4 border-b border-outline-variant/50">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="doc-search"
                placeholder="Buscar documentos..."
                className="pl-9"
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
              <Select value={typeFilter || '__all__'} onValueChange={v => setTypeFilter(v === '__all__' ? '' : v)}>
                <SelectTrigger id="doc-type-filter" className="h-9 w-40">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos los tipos</SelectItem>
                  {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter || '__all__'} onValueChange={v => setStatusFilter(v === '__all__' ? '' : v)}>
                <SelectTrigger id="doc-status-filter" className="h-9 w-40">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos los estados</SelectItem>
                  {DOC_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {activeFilters > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-error-500 border-error-500/30 hover:bg-error-500/5">
                  Limpiar ({activeFilters})
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
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && filteredDocuments.length === 0 ? (
                <tr><TableCell colSpan={7} className="h-32 text-center text-neutral-400">Cargando documentos...</TableCell></tr>
              ) : filteredDocuments.length === 0 ? (
                <tr><TableCell colSpan={7} className="h-32 text-center text-neutral-400">No hay documentos que coincidan con los filtros</TableCell></tr>
              ) : (
                filteredDocuments.map((doc) => (
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
                    <TableCell className="text-neutral-600">{getLeadName(doc.leadId)}</TableCell>
                    <TableCell><Badge variant={statusVariants[doc.status]}>{doc.status}</Badge></TableCell>
                    <TableCell className="text-neutral-600">{formatDate(doc.updated_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isLoading}><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadDocument(doc.id)}>
                            <Download className="h-4 w-4 mr-2" /> Descargar
                          </DropdownMenuItem>
                          {doc.status === 'Borrador' && (
                            <DropdownMenuItem onClick={() => handleSendDocument(doc.id)}>
                              <Send className="h-4 w-4 mr-2" /> Enviar
                            </DropdownMenuItem>
                          )}
                          {doc.status === 'Enviado' && (
                            <DropdownMenuItem onClick={() => handleSignDocument(doc.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" /> Marcar Firmado
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)} className="text-error-500">
                            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Document Modal */}
      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Subir Documento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Archivo *</label>
              <input
                id="doc-file-input"
                type="file"
                className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-sm file:font-medium hover:file:bg-primary/20 mt-1"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nombre del Documento *</label>
              <Input
                id="doc-name"
                placeholder="Ej: Plano arquitectónico"
                value={newDoc.name}
                onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select value={newDoc.type} onValueChange={v => setNewDoc({ ...newDoc, type: v as typeof newDoc.type })}>
                  <SelectTrigger className="w-full mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Propiedad *</label>
                <Select value={newDoc.property_id || '__none__'} onValueChange={v => setNewDoc({ ...newDoc, property_id: v === '__none__' ? '' : v })}>
                  <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Seleccionar...</SelectItem>
                    {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lead (opcional)</label>
              <Select value={newDoc.lead_id || '__none__'} onValueChange={v => setNewDoc({ ...newDoc, lead_id: v === '__none__' ? '' : v })}>
                <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Sin lead vinculado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin lead vinculado</SelectItem>
                  {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocModal(false)}>Cancelar</Button>
            <Button onClick={handleAddDocument} disabled={isLoading}><Plus className="h-4 w-4 mr-2" />{isLoading ? 'Subiendo...' : 'Subir'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Wizard */}
      <Dialog open={showWizardModal} onOpenChange={setShowWizardModal}>
        <DialogContent className={wizardStep === 3 ? 'max-w-4xl max-h-[90vh] overflow-y-auto' : 'max-w-lg'}>
          <DialogHeader><DialogTitle>Generador de Contratos</DialogTitle></DialogHeader>

          {/* Progress bar */}
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= wizardStep ? 'bg-primary' : 'bg-neutral-100'}`} />
            ))}
          </div>

          {/* Step 1 */}
          {wizardStep === 1 && (
            <div className="space-y-4 py-4">
              <h3 className="font-semibold text-lg">Paso 1: Seleccionar Cliente</h3>
              <div>
                <label className="text-sm font-medium">Cliente (Lead) *</label>
                <Select value={wizardData.lead_id || '__none__'} onValueChange={v => setWizardData({ ...wizardData, lead_id: v === '__none__' ? '' : v })}>
                  <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Seleccionar lead..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Seleccionar lead...</SelectItem>
                    {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name} — {l.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {selectedLead && (
                <div className="bg-neutral-50 p-4 rounded-lg text-sm">
                  <p><strong>Datos encontrados:</strong></p>
                  <p>Teléfono: {selectedLead.phone}</p>
                  <p>Email: {selectedLead.email}</p>
                  {selectedLead.payment_config && <p>Pago: {selectedLead.payment_config.type}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {wizardStep === 2 && (
            <div className="space-y-4 py-4">
              <h3 className="font-semibold text-lg">Paso 2: Operación y Propiedad</h3>
              <div>
                <label className="text-sm font-medium">Tipo de Operación</label>
                <Select value={wizardData.type} onValueChange={v => setWizardData({ ...wizardData, type: v as 'compra' | 'alquiler' })}>
                  <SelectTrigger className="w-full mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compra">Compraventa</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Negocio vinculado (Opcional)</label>
                <Select
                  value={wizardData.deal_id || '__none__'}
                  onValueChange={v => {
                    const deal = deals.find(d => d.id === v)
                    setWizardData({ ...wizardData, deal_id: v === '__none__' ? '' : v, property_id: deal?.property_id || wizardData.property_id })
                  }}
                >
                  <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Sin negocio específico" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sin negocio específico</SelectItem>
                    {leadDeals.map(d => <SelectItem key={d.id} value={d.id}>{d.title} ({formatCurrency(d.value)})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {!wizardData.deal_id && (
                <div>
                  <label className="text-sm font-medium">Propiedad *</label>
                  <Select value={wizardData.property_id || '__none__'} onValueChange={v => setWizardData({ ...wizardData, property_id: v === '__none__' ? '' : v })}>
                    <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Seleccionar propiedad..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Seleccionar propiedad...</SelectItem>
                      {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contract preview */}
          {wizardStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="print:hidden flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Paso 3: Vista Previa</h3>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" /> Imprimir / PDF
                </Button>
              </div>
              <div className="border border-neutral-200 p-8 md:p-12 bg-white text-black font-serif text-justify print:border-none print:p-0 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm print:shadow-none">
                <div className="flex justify-between items-start mb-12">
                  <img src="/logo.png" alt="Grupo Siena" className="h-16 object-contain" />
                  <div className="text-right text-sm text-gray-500 font-sans">
                    <p>CONTRATO DE {wizardData.type.toUpperCase()}</p>
                    <p>Nº Ref: {docRef}</p>
                    <p>Fecha: {currentDate}</p>
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
                    {selectedLead?.payment_config?.type === 'cuotas'
                      ? ` La operación se realizará en cuotas, con un anticipo de ${formatCurrency(selectedLead.payment_config.down_payment || 0)} y el resto en ${selectedLead.payment_config.installments} cuotas.`
                      : selectedLead?.payment_config?.type === 'hipoteca'
                        ? ` La operación se realizará mediante crédito hipotecario del banco ${selectedLead.payment_config.bank}.`
                        : ' La operación se realizará al contado en su totalidad.'}
                  </p>
                  <p>
                    <strong>TERCERA (CONDICIONES):</strong> El inmueble se entrega en el estado en que se encuentra, libre de ocupantes
                    y con los impuestos al día. Las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad
                    para cualquier divergencia originada en el presente contrato.
                  </p>
                  <div className="pt-24 flex justify-between px-12">
                    <div className="text-center">
                      <div className="border-t border-black w-48 mb-2" />
                      <p className="font-bold">GRUPO SIENA</p>
                      <p className="text-xs">Representante Legal</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-black w-48 mb-2" />
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
                <CheckCircle className="h-4 w-4 mr-2" /> Guardar Contrato
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
