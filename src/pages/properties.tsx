import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  PropertiesTable,
  PropertyDetailModal,
  PropertyFormModal,
  DeletePropertyDialog,
  useProperties,
} from '@/features/properties'

export function PropertiesPage() {
  const {
    properties,
    filteredProperties,
    selectedProperty,
    editingProperty,
    deleteConfirmId,
    formData,
    search,
    typeFilter,
    statusFilter,
    ui,
    setSearch,
    setFormData,
    setSelectedPropertyId,
    setDeleteConfirmId,
    setEditingPropertyId,
    openModal,
    closeModal,
    setActivePage,
    toggleTypeFilter,
    toggleStatusFilter,
    handleSaveNew,
    handleSaveEdit,
    handleArchive,
    handleDelete,
    openEditModal,
  } = useProperties()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Propiedades</h1>
          <p className="text-neutral-600 mt-1">{properties.length} propiedades en portfolio</p>
        </div>
        <Button id="add-property-btn" onClick={() => openModal('addProperty')}>
          <Plus className="h-4 w-4" />
          Agregar Propiedad
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <PropertiesTable
            properties={filteredProperties}
            search={search}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            formData={formData}
            onSearchChange={setSearch}
            onToggleType={toggleTypeFilter}
            onToggleStatus={toggleStatusFilter}
            onView={(id) => setSelectedPropertyId(id)}
            onEdit={openEditModal}
            onArchive={handleArchive}
            onDeleteConfirm={(id) => setDeleteConfirmId(id)}
          />
        </CardHeader>
        <CardContent className="p-0" />
      </Card>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        open={!!selectedProperty}
        onClose={() => setSelectedPropertyId(null)}
        onGoToLeads={() => { setActivePage('leads'); setSelectedPropertyId(null) }}
        onGoToVisits={() => { setActivePage('visitas'); setSelectedPropertyId(null) }}
      />

      <PropertyFormModal
        open={ui.modals.addProperty}
        title="Agregar Propiedad"
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveNew}
        onCancel={() => closeModal('addProperty')}
      />

      <PropertyFormModal
        open={!!editingProperty}
        title="Editar Propiedad"
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPropertyId(null)}
        isEdit
      />

      <DeletePropertyDialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
      />
    </div>
  )
}
