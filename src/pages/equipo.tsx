import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Search, DollarSign, Building2, TrendingUp, RotateCw } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { AgentCard, AgentFormModal, DeleteAgentDialog, AgentEmptyState, useEquipo } from '@/features/equipo'
import { Can } from '@/features/auth'

export function EquipoPage() {
  const {
    agents,
    filteredAgents,
    deleteTargetAgent,
    search,
    showAddModal,
    editingAgentId,
    deleteConfirmId,
    form,
    teamStats,
    setSearch,
    setShowAddModal,
    setEditingAgentId,
    setDeleteConfirmId,
    setForm,
    openAddModal,
    openEditModal,
    handleAdd,
    handleEdit,
    handleDelete,
    getAgentMetrics,
    loadingAgents,
    refreshAgents,
  } = useEquipo()

  const deleteMetrics = deleteTargetAgent ? getAgentMetrics(deleteTargetAgent.id) : { activeDeals: 0, agentLeads: 0, totalValue: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Equipo</h1>
          <p className="text-neutral-600 mt-1">{agents.length} miembros en tu equipo</p>
        </div>
        <Can perform="equipo:create">
          <Button id="add-agent-btn" onClick={openAddModal}>
            <UserPlus className="h-4 w-4" />
            Agregar Miembro
          </Button>
        </Can>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase text-neutral-500">Ingresos Totales</p>
            </div>
            <p className="text-2xl font-bold font-heading text-primary">{formatCurrency(teamStats.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning-500/10 to-warning-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-warning-500" />
              <p className="text-xs uppercase text-neutral-500">Negocios Activos</p>
            </div>
            <p className="text-2xl font-bold font-heading text-warning-500">{teamStats.totalActiveDeals}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success-500/10 to-success-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success-500" />
              <p className="text-xs uppercase text-neutral-500">Cierres Totales</p>
            </div>
            <p className="text-2xl font-bold font-heading text-success-500">{teamStats.totalClosed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            id="agent-search"
            placeholder="Buscar por nombre, email o rol..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshAgents}
          disabled={loadingAgents}
          title="Refrescar asesores"
        >
          <RotateCw className={cn("h-4 w-4", loadingAgents && "animate-spin")} />
        </Button>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.length === 0 ? (
          <AgentEmptyState />
        ) : filteredAgents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            metrics={getAgentMetrics(agent.id)}
            onEdit={openEditModal}
            onDelete={setDeleteConfirmId}
          />
        ))}
      </div>

      {/* Add Modal */}
      <AgentFormModal
        open={showAddModal}
        form={form}
        onFormChange={setForm}
        onSave={handleAdd}
        onCancel={() => setShowAddModal(false)}
      />

      {/* Edit Modal */}
      <AgentFormModal
        open={!!editingAgentId}
        isEdit
        form={form}
        onFormChange={setForm}
        onSave={handleEdit}
        onCancel={() => setEditingAgentId(null)}
      />

      {/* Delete Confirm */}
      <DeleteAgentDialog
        open={!!deleteConfirmId}
        agentName={deleteTargetAgent?.name}
        activeDeals={deleteMetrics.activeDeals}
        agentLeads={deleteMetrics.agentLeads}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
