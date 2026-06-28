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
  Search, SlidersHorizontal, FileSignature,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DOC_TYPES, DOC_STATUSES, typeIcons, statusVariants } from '@/features/documentos/constants'
import { useDocumentos, ContractWizard } from '@/features/documentos'

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
                  {leads.map(l => <SelectItem key={l.id} value={l.id}>{`${l.firstName} ${l.lastName}`.trim()}</SelectItem>)}
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

      {/* Contract Wizard (Refactored to modular Compound Component) */}
      <ContractWizard
        open={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        wizardStep={wizardStep}
        wizardData={wizardData}
        setWizardStep={setWizardStep}
        setWizardData={setWizardData}
        leads={leads}
        properties={properties}
        deals={deals}
        selectedLead={selectedLead}
        selectedDeal={selectedDeal}
        selectedProp={selectedProp}
        leadDeals={leadDeals}
        docRef={docRef}
        currentDate={currentDate}
        handlePrint={handlePrint}
        handleFinishWizard={handleFinishWizard}
      />
    </div>
  )
}
