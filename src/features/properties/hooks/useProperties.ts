import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { Property } from '@/store/slices/propertiesSlice'
import type { PropertyFormData } from '../types'
import { PROPERTY_FORM_DEFAULT } from '../types'

export function useProperties() {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    archiveProperty,
    addToast,
    openModal,
    closeModal,
    ui,
    setActivePage,
  } = useStore()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PropertyFormData>(PROPERTY_FORM_DEFAULT)

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

  const handleSaveNew = () => {
    if (!formData.title || !formData.city) {
      addToast({ title: 'Error', description: 'Completá los campos obligatorios', variant: 'error' })
      return
    }
    addProperty({
      ...formData,
      photos: [],
      created_at: new Date().toISOString().split('T')[0],
      views: 0,
      interested: 0,
    })
    addToast({ title: 'Propiedad creada', description: `${formData.title} fue agregada correctamente`, variant: 'success' })
    closeModal('addProperty')
    setFormData(PROPERTY_FORM_DEFAULT)
  }

  const handleSaveEdit = () => {
    if (!editingPropertyId) return
    updateProperty(editingPropertyId, formData)
    addToast({ title: 'Propiedad actualizada', description: `${formData.title} fue modificada`, variant: 'success' })
    setEditingPropertyId(null)
    setFormData(PROPERTY_FORM_DEFAULT)
  }

  const handleArchive = (id: string) => {
    const prop = properties.find(p => p.id === id)
    archiveProperty(id)
    addToast({ title: 'Propiedad archivada', description: `${prop?.title} fue archivada`, variant: 'success' })
  }

  const handleDelete = (id: string) => {
    const prop = properties.find(p => p.id === id)
    deleteProperty(id)
    addToast({ title: 'Propiedad eliminada', description: `${prop?.title} fue eliminada`, variant: 'success' })
    setDeleteConfirmId(null)
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
    })
    setEditingPropertyId(property.id)
  }

  return {
    // state
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
    // setters
    setSearch,
    setFormData,
    setSelectedPropertyId,
    setDeleteConfirmId,
    setEditingPropertyId,
    // actions
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
  }
}
