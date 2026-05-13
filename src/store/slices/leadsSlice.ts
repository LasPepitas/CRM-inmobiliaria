import type { StateCreator } from 'zustand'
import type { Store } from '../index'

import type { Lead } from '../../features/leads/types'

const mockLeads: Lead[] = [
  { id: '1', name: 'María González López', source: 'Web', phone: '+54 11 4567-8901', email: 'maria.gonzalez@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 85, status: 'Activo', last_contact: '2024-04-15', budget: 50000000, notes: 'Interesada en casas de 4 ambientes en Palermo' },
  { id: '2', name: 'Carlos Rodríguez Fernández', source: 'Referido', phone: '+54 11 4567-8902', email: 'carlos.rodriguez@mail.com', stage: 'Visita', assigned_agent: '2', score: 72, status: 'Activo', last_contact: '2024-04-14', budget: 35000000, notes: 'Busca departamento en Recoleta' },
  { id: '3', name: 'Ana Martínez Silva', source: 'Redes', phone: '+54 11 4567-8903', email: 'ana.martinez@mail.com', stage: 'Contactado', assigned_agent: '1', score: 65, last_contact: '2024-04-13', budget: 25000000, notes: 'Primera vivienda', status: 'Activo' },
  { id: '4', name: 'Pedro Sánchez Ruiz', source: 'Web', phone: '+54 11 4567-8904', email: 'pedro.sanchez@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 45, last_contact: '2024-04-12', budget: 40000000, notes: 'Inversionista', status: 'Activo' },
  { id: '5', name: 'Laura Hernández Vega', source: 'Expo', phone: '+54 11 4567-8905', email: 'laura.hernandez@mail.com', stage: 'Cierre', assigned_agent: '2', score: 95, last_contact: '2024-04-15', budget: 75000000, notes: 'Cierre próximo', status: 'Activo' },
  { id: '6', name: 'Miguel Torres Luna', source: 'Contacto', phone: '+54 11 4567-8906', email: 'miguel.torres@mail.com', stage: 'Visita', assigned_agent: '1', score: 78, last_contact: '2024-04-14', budget: 30000000, notes: 'Busca oficina en Catalinas', status: 'Activo' },
  { id: '7', name: 'Sofia Ramírez Ortega', source: 'Referido', phone: '+54 11 4567-8907', email: 'sofia.ramirez@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 88, last_contact: '2024-04-15', budget: 60000000, notes: 'Cliente de alto patrimonio', status: 'Activo' },
  { id: '8', name: 'Diego Morales Castro', source: 'Web', phone: '+54 11 4567-8908', email: 'diego.morales@mail.com', stage: 'Contactado', assigned_agent: '2', score: 55, last_contact: '2024-04-11', budget: 28000000, notes: 'Interesado en Nordelta', status: 'Activo' },
  { id: '9', name: 'Valentina Cruz Bravo', source: 'Redes', phone: '+54 11 4567-8909', email: 'valentina.cruz@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 40, last_contact: '2024-04-10', budget: 20000000, notes: 'Joven profesional', status: 'Activo' },
  { id: '10', name: 'Javier Flores Ríos', source: 'Expo', phone: '+54 11 4567-8910', email: 'javier.flores@mail.com', stage: 'Visita', assigned_agent: '1', score: 70, last_contact: '2024-04-14', budget: 45000000, notes: 'Família numerosa', status: 'Activo' },
  { id: '11', name: 'Lucia Navarro Jiménez', source: 'Referido', phone: '+54 11 4567-8911', email: 'lucia.navarro@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 82, last_contact: '2024-04-15', budget: 55000000, notes: 'Upgrade de vivienda', status: 'Activo' },
  { id: '12', name: 'Andrés Castro Molina', source: 'Web', phone: '+54 11 4567-8912', email: 'andres.castro@mail.com', stage: 'Contactado', assigned_agent: '2', score: 58, last_contact: '2024-04-12', budget: 32000000, notes: 'Busca terreno en Pinamar', status: 'Activo' },
  { id: '13', name: 'Carmen Delgado Peña', source: 'Contacto', phone: '+54 11 4567-8913', email: 'carmen.delgado@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 35, last_contact: '2024-04-09', budget: 15000000, notes: 'Presupuesto limitado', status: 'Activo' },
  { id: '14', name: 'Pablo Reyes Peña', source: 'Redes', phone: '+54 11 4567-8914', email: 'pablo.reyes@mail.com', stage: 'Visita', assigned_agent: '1', score: 75, last_contact: '2024-04-14', budget: 40000000, notes: 'Empresario', status: 'Activo' },
  { id: '15', name: 'Isabel Vargas Díaz', source: 'Referido', phone: '+54 11 4567-8915', email: 'isabel.vargas@mail.com', stage: 'Cierre', assigned_agent: '4', score: 92, last_contact: '2024-04-15', budget: 80000000, notes: 'Alta probabilidad de cierre', status: 'Activo' },
  { id: '16', name: 'Francisco Ruiz Sánchez', source: 'Expo', phone: '+54 11 4567-8916', email: 'francisco.ruiz@mail.com', stage: 'Contactado', assigned_agent: '2', score: 62, last_contact: '2024-04-13', budget: 38000000, notes: 'Busca departamento en Puerto Madero', status: 'Activo' },
  { id: '17', name: 'Elena Mendoza Rojas', source: 'Web', phone: '+54 11 4567-8917', email: 'elena.mendoza@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 48, last_contact: '2024-04-11', budget: 27000000, notes: 'Primera vivienda', status: 'Activo' },
  { id: '18', name: 'Antonio Herrera Gil', source: 'Contacto', phone: '+54 11 4567-8918', email: 'antonio.herrera@mail.com', stage: 'Visita', assigned_agent: '1', score: 68, last_contact: '2024-04-14', budget: 42000000, notes: 'Inversionista inmobiliario', status: 'Activo' },
  { id: '19', name: 'Patricia Luna Romero', source: 'Referido', phone: '+54 11 4567-8919', email: 'patricia.luna@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 80, last_contact: '2024-04-15', budget: 52000000, notes: 'Upgrade a casa más grande', status: 'Activo' },
  { id: '20', name: 'Roberto Medina Ali', source: 'Redes', phone: '+54 11 4567-8920', email: 'roberto.medina@mail.com', stage: 'Contactado', assigned_agent: '2', score: 52, last_contact: '2024-04-12', budget: 29000000, notes: 'Busca en Martínez', status: 'Activo' },
  { id: '21', name: 'Mercedes Castro Gil', source: 'Web', phone: '+54 11 4567-8921', email: 'mercedes.castro@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 38, last_contact: '2024-04-10', budget: 18000000, notes: 'Estudiante', status: 'Activo' },
  { id: '22', name: 'Daniel Ortega Vega', source: 'Expo', phone: '+54 11 4567-8922', email: 'daniel.ortega@mail.com', stage: 'Visita', assigned_agent: '1', score: 73, last_contact: '2024-04-14', budget: 35000000, notes: 'Matrimonio joven', status: 'Activo' },
  { id: '23', name: 'Sara Núñez Pérez', source: 'Referido', phone: '+54 11 4567-8923', email: 'sara.nunez@mail.com', stage: 'Contactado', assigned_agent: '4', score: 60, last_contact: '2024-04-13', budget: 33000000, notes: 'Busca en Pilar', status: 'Activo' },
  { id: '24', name: 'Gabriel Silva Díaz', source: 'Contacto', phone: '+54 11 4567-8924', email: 'gabriel.silva@mail.com', stage: 'Nuevo', assigned_agent: '2', score: 42, last_contact: '2024-04-11', budget: 22000000, notes: 'Primeros pasos', status: 'Activo' },
  { id: '25', name: 'Rosa María Torres', source: 'Web', phone: '+54 11 4567-8925', email: 'rosa.torres@mail.com', stage: 'Visita', assigned_agent: '3', score: 77, last_contact: '2024-04-14', budget: 48000000, notes: 'Busca casa con jardín', status: 'Activo' },
  { id: '26', name: 'Luis Fernando Moreno', source: 'Redes', phone: '+54 11 4567-8926', email: 'luis.moreno@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 86, last_contact: '2024-04-15', budget: 58000000, notes: 'Inversionista experimentado', status: 'Activo' },
  { id: '27', name: 'Adriana Herrera Soto', source: 'Referido', phone: '+54 11 4567-8927', email: 'adriana.herrera@mail.com', stage: 'Contactado', assigned_agent: '4', score: 56, last_contact: '2024-04-12', budget: 26000000, notes: 'Busca en San Telmo', status: 'Activo' },
  { id: '28', name: 'Ricardo Vázquez Roca', source: 'Expo', phone: '+54 11 4567-8928', email: 'ricardo.vazquez@mail.com', stage: 'Nuevo', assigned_agent: '2', score: 44, last_contact: '2024-04-10', budget: 19000000, notes: 'Joven profesional', status: 'Activo' },
  { id: '29', name: 'Natalia Paredes Soto', source: 'Web', phone: '+54 11 4567-8929', email: 'natalia.paredes@mail.com', stage: 'Visita', assigned_agent: '3', score: 71, last_contact: '2024-04-14', budget: 44000000, notes: 'Família con hijos', status: 'Activo' },
  { id: '30', name: 'Fernando Ruiz Gil', source: 'Contacto', phone: '+54 11 4567-8930', email: 'fernando.ruiz@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 84, last_contact: '2024-04-15', budget: 56000000, notes: 'Cierre en proceso', status: 'Activo' },
]

export interface LeadsSlice {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  updateLeadPayment: (id: string, config: Lead['payment_config']) => void
  discardLead: (id: string, reason: string, notes?: string) => void
  reactivateLead: (id: string) => void
}

export const createLeadsSlice: StateCreator<Store, [], [], LeadsSlice> = (set) => ({
  leads: mockLeads,
  addLead: (lead) => set((state) => ({
    leads: [...state.leads, { ...lead, id: String(state.leads.length + 1) }]
  })),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter(l => l.id !== id)
  })),
  updateLeadPayment: (id, config) => set((state) => ({
    leads: state.leads.map(l => l.id === id ? { ...l, payment_config: config } : l)
  })),
  discardLead: (id, reason) => set((state) => ({
    leads: state.leads.map(l => l.id === id
      ? { ...l, status: 'No Interesado' as const, discard_reason: reason, discarded_at: new Date().toISOString().split('T')[0] }
      : l
    ),
    deals: state.deals.map(d => d.lead_id === id
      ? { ...d, stage: 'Cancelado' as const, last_update: new Date().toISOString().split('T')[0] }
      : d
    )
  })),
  reactivateLead: (id) => set((state) => ({
    leads: state.leads.map(l => l.id === id
      ? { ...l, status: 'Activo' as const, discard_reason: undefined, discarded_at: undefined }
      : l
    ),
    deals: state.deals.map(d => d.lead_id === id && d.stage === 'Cancelado'
      ? { ...d, stage: 'Nuevo' as const, last_update: new Date().toISOString().split('T')[0] }
      : d
    )
  }))
})
