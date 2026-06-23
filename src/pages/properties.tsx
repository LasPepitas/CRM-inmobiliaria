import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, Loader2 } from 'lucide-react'
import {
  PropertiesTable,
  PropertyDetailModal,
  PropertyFormModal,
  DeletePropertyDialog,
  useProperties,
} from '@/features/properties'
import { useNavigate } from 'react-router-dom'

export function PropertiesPage() {
  const navigate = useNavigate()
  const {
    properties,
    propertiesLoading,
    propertiesError,
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
    toggleTypeFilter,
    toggleStatusFilter,
    handleSaveNew,
    handleSaveEdit,
    handleArchive,
    handleDelete,
    openEditModal,
    fetchProperties,
    handleTogglePublish,
  } = useProperties()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Propiedades</h1>
          <p className="text-neutral-600 mt-1">
            {propertiesLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Cargando portfolio...
              </span>
            ) : (
              `${properties.length} propiedades en portfolio`
            )}
          </p>
        </div>
        <Button id="add-property-btn" onClick={() => openModal('addProperty')}>
          <Plus className="h-4 w-4" />
          Agregar Propiedad
        </Button>
      </div>

      {/* Banner de error del backend */}
      {propertiesError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">Error al cargar propiedades: {propertiesError}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProperties()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Reintentar
          </Button>
        </div>
      )}

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
            onTogglePublish={handleTogglePublish}
          />
        </CardHeader>
        <CardContent className="p-0" />
      </Card>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        open={!!selectedProperty}
        onClose={() => setSelectedPropertyId(null)}
        onGoToLeads={() => { navigate('/dashboard/leads'); setSelectedPropertyId(null) }}
        onGoToVisits={() => { navigate('/dashboard/visitas'); setSelectedPropertyId(null) }}
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
