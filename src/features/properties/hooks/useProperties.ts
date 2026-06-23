import { useState, useMemo, useEffect } from 'react'
import { useStore } from '@/store'
import type { Property } from '@/store/slices/propertiesSlice'
import type { PropertyFormData } from '../types'
import { PROPERTY_FORM_DEFAULT } from '../types'

export function useProperties() {
  const {
    properties,
    propertiesLoading,
    propertiesError,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    archiveProperty,
    addToast,
    openModal,
    closeModal,
    ui,
  } = useStore()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PropertyFormData>(PROPERTY_FORM_DEFAULT)

  const propertiesFetched = useStore(state => state.propertiesFetched)

  // Carga inicial desde el backend al montar el módulo
  useEffect(() => {
    if (!propertiesFetched) fetchProperties()
  }, [fetchProperties, propertiesFetched])

  const filteredProperties = useMemo(() =>
    properties.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter.length === 0 || typeFilter.includes(p.type)
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(p.status)
      return matchesSearch && matchesType && matchesStatus
    }),
    [properties, search, typeFilter, statusFilter]
  )

  const selectedProperty = useMemo(
    () => properties.find(p => p.id === selectedPropertyId),
    [properties, selectedPropertyId]
  )

  const editingProperty = useMemo(
    () => properties.find(p => p.id === editingPropertyId),
    [properties, editingPropertyId]
  )

  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])
  }

  const handleSaveNew = async () => {
    if (!formData.title || !formData.city) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    try {
      await addProperty(formData)
      addToast({ title: 'Propiedad creada', description: `${formData.title} fue agregada correctamente`, variant: 'success' })
      closeModal('addProperty')
      setFormData(PROPERTY_FORM_DEFAULT)
    } catch (err) {
      addToast({
        title: 'Error al crear propiedad',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!editingPropertyId) return
    try {
      await updateProperty(editingPropertyId, formData)
      addToast({ title: 'Propiedad actualizada', description: `${formData.title} fue modificada`, variant: 'success' })
      setEditingPropertyId(null)
      setFormData(PROPERTY_FORM_DEFAULT)
    } catch (err) {
      addToast({
        title: 'Error al actualizar propiedad',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  const handleArchive = async (id: string) => {
    const prop = properties.find(p => p.id === id)
    try {
      await archiveProperty(id)
      addToast({ title: 'Propiedad archivada', description: `${prop?.title} fue archivada`, variant: 'success' })
    } catch (err) {
      addToast({
        title: 'Error al archivar propiedad',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  const handleDelete = async (id: string) => {
    const prop = properties.find(p => p.id === id)
    try {
      await deleteProperty(id)
      addToast({ title: 'Propiedad eliminada', description: `${prop?.title} fue eliminada`, variant: 'success' })
      setDeleteConfirmId(null)
    } catch (err) {
      addToast({
        title: 'Error al eliminar propiedad',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  const openEditModal = (property: Property) => {
    setFormData({
      title: property.title,
      type: property.type,
      price: property.price,
      city: property.city,
      neighborhood: property.neighborhood,
      area_m2: property.area_m2,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      status: property.status,
      imageUrl: property.photos?.[0] || '',
      isPublished: property.isPublished,
    })
    setEditingPropertyId(property.id)
  }

  const handleTogglePublish = async (property: Property) => {
    try {
      const formDataToUpdate: PropertyFormData = {
        title: property.title,
        type: property.type,
        price: property.price,
        city: property.city,
        neighborhood: property.neighborhood,
        area_m2: property.area_m2,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        status: property.status,
        imageUrl: property.photos?.[0] || '',
        isPublished: !property.isPublished,
      }
      await updateProperty(property.id, formDataToUpdate)
      addToast({
        title: property.isPublished ? 'Propiedad despublicada' : 'Propiedad publicada',
        description: `${property.title} cambió su estado de publicación`,
        variant: 'success',
      })
    } catch (err) {
      addToast({
        title: 'Error al cambiar estado de publicación',
        description: err instanceof Error ? err.message : 'Intente nuevamente',
        variant: 'error',
      })
    }
  }

  return {
    // state
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
    // setters
    setSearch,
    setFormData,
    setSelectedPropertyId,
    setDeleteConfirmId,
    setEditingPropertyId,
    // actions
    fetchProperties,
    openModal,
    closeModal,
    toggleTypeFilter,
    toggleStatusFilter,
    handleSaveNew,
    handleSaveEdit,
    handleArchive,
    handleDelete,
    openEditModal,
    handleTogglePublish,
  }
}
