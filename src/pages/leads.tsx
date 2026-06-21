import { Search, Plus, XCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  LeadsTable,
  LeadsDiscardedTable,
  LeadFormModal,
  LeadConvertModal,
  LeadDiscardModal,
  LeadDetailModal,
  useLeads,
} from '@/features/leads'

const STAGE_FILTERS = ['Nuevo', 'Contactado', 'Visita', 'Negociacion', 'Cierre'] as const

export function LeadsPage() {
  const logic = useLeads()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Leads</h1>
          <p className="text-neutral-600 mt-1">
            {logic.activeLeads.length} leads activos · {logic.discardedLeads.length} descartados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => logic.setActiveTab('activos')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                logic.activeTab === 'activos' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              Activos ({logic.activeLeads.length})
            </button>
            <button
              onClick={() => logic.setActiveTab('descartados')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                logic.activeTab === 'descartados' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <XCircle className="h-3.5 w-3.5" />
              Descartados ({logic.discardedLeads.length})
            </button>
          </div>
          <Button onClick={() => logic.setShowNewLeadModal(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {logic.activeTab === 'activos' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  className="pl-10"
                  value={logic.search}
                  onChange={(e) => logic.setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {STAGE_FILTERS.map((stage) => (
                  <Button
                    key={stage}
                    variant={logic.stageFilter.includes(stage) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => logic.setStageFilter(prev =>
                      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
                    )}
                    className={cn(logic.stageFilter.includes(stage) && 'bg-primary text-primary-foreground')}
                  >
                    {stage}
                  </Button>
                ))}
              </div>
            </div>

            {logic.loadingLeads ? (
              <div className="h-48 flex items-center justify-center text-neutral-400">Cargando leads...</div>
            ) : (
              <LeadsTable
                leads={logic.filteredLeads}
                getAgentName={logic.getAgentName}
                onViewDetail={(id) => logic.setSelectedLead(id)}
                onEdit={logic.openEditModal}
                onConvert={logic.openConvertModal}
                onDiscard={(id) => { logic.setDiscardingLead(id); logic.setDiscardForm({ reason: 'precio', notes: '' }) }}
                onDelete={logic.handleDeleteLead}
              />
            )}
          </CardContent>
        </Card>
      )}

      {logic.activeTab === 'descartados' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0" />
              <p className="text-sm text-warning-700">
                <strong>{logic.discardedLeads.length} leads descartados.</strong> Sus negocios vinculados fueron marcados como Cancelados. Podés reactivarlos en cualquier momento.
              </p>
            </div>
            <LeadsDiscardedTable
              leads={logic.discardedLeads}
              getAgentName={logic.getAgentName}
              onReactivate={logic.handleReactivate}
              onDelete={logic.handleDeleteLead}
            />
          </CardContent>
        </Card>
      )}

      <LeadDiscardModal
        leadId={logic.discardingLead}
        onClose={() => logic.setDiscardingLead(null)}
        form={logic.discardForm}
        setForm={logic.setDiscardForm}
        onConfirm={logic.handleDiscard}
      />

      <LeadConvertModal
        leadId={logic.convertingLead}
        onClose={() => logic.setConvertingLead(null)}
        form={logic.convertForm}
        setForm={logic.setConvertForm}
        onConfirm={logic.handleConvertToDeal}
      />

      <LeadFormModal
        open={logic.showNewLeadModal || !!logic.editingLead}
        onClose={() => { logic.setShowNewLeadModal(false); logic.setEditingLead(null); logic.resetNewLeadForm() }}
        form={logic.newLead}
        setForm={(form) => logic.setNewLead(form)}
        isEditing={!!logic.editingLead}
        onSave={logic.handleSaveLead}
      />

      <LeadDetailModal
        leadId={logic.selectedLead}
        onClose={() => logic.setSelectedLead(null)}
        paymentForm={logic.paymentForm}
        setPaymentForm={logic.setPaymentForm}
        onSavePayment={logic.handleSavePayment}
      />
    </div>
  )
}
