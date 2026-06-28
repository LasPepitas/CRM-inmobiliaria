import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Search, RotateCw, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AgentTable, AgentFormModal, DeleteAgentDialog, useEquipo } from '@/features/equipo'
import { AGENT_ROLES } from '@/features/equipo/types'
import { Can } from '@/features/auth'

export function EquipoPage() {
  const {
    agents,
    filteredAgents,
    deleteTargetAgent,
    search,
    roleFilter,
    showAddModal,
    editingAgentId,
    deleteConfirmId,
    form,
    loadingAgents,
    setSearch,
    setRoleFilter,
    setShowAddModal,
    setEditingAgentId,
    setDeleteConfirmId,
    setForm,
    openAddModal,
    openEditModal,
    handleAdd,
    handleEdit,
    handleDelete,
    refreshAgents,
  } = useEquipo()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Equipo</h1>
          <p className="text-neutral-600 mt-1">
            {loadingAgents ? 'Cargando...' : `${agents.length} miembros en tu equipo`}
          </p>
        </div>
        <Can perform="equipo:create">
          <Button id="add-agent-btn" onClick={openAddModal}>
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Miembro
          </Button>
        </Can>
      </div>

      <Card>
        <CardContent className="p-4 border-b border-outline-variant/50">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="agent-search"
                placeholder="Buscar por nombre, email o rol..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
              <Select value={roleFilter || '__all__'} onValueChange={v => setRoleFilter(v === '__all__' ? '' : v)}>
                <SelectTrigger id="agent-role-filter" className="h-9 w-44">
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos los roles</SelectItem>
                  {AGENT_ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshAgents}
                disabled={loadingAgents}
                title="Refrescar"
              >
                <RotateCw className={cn('h-4 w-4', loadingAgents && 'animate-spin')} />
              </Button>
              <span className="text-sm text-neutral-500">{filteredAgents.length} usuarios</span>
            </div>
          </div>
        </CardContent>
        <CardContent className="p-0">
          <AgentTable
            agents={filteredAgents}
            isLoading={loadingAgents}
            onEdit={openEditModal}
            onDelete={setDeleteConfirmId}
          />
        </CardContent>
      </Card>

      <AgentFormModal
        open={showAddModal}
        form={form}
        onFormChange={setForm}
        onSave={handleAdd}
        onCancel={() => setShowAddModal(false)}
      />

      <AgentFormModal
        open={!!editingAgentId}
        isEdit
        form={form}
        onFormChange={setForm}
        onSave={handleEdit}
        onCancel={() => setEditingAgentId(null)}
      />

      <DeleteAgentDialog
        open={!!deleteConfirmId}
        agentName={deleteTargetAgent?.name}
        activeDeals={0}
        agentLeads={0}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
