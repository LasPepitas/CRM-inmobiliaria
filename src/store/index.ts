import { create } from 'zustand'

export interface Property {
  id: string
  title: string
  type: 'Casa' | 'Departamento' | 'Terreno' | 'Oficina'
  price: number
  status: 'Disponible' | 'Reservado' | 'Vendido'
  city: string
  neighborhood: string
  area_m2: number
  bedrooms: number
  bathrooms: number
  photos: string[]
  created_at: string
  views: number
  interested: number
}

export interface Lead {
  id: string
  name: string
  source: 'Web' | 'Referido' | 'Contacto' | 'Redes' | 'Expo'
  phone: string
  email: string
  stage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre'
  assigned_agent: string
  score: number
  last_contact: string
  budget: number
  notes: string
  payment_config?: {
    type: 'contado' | 'cuotas' | 'hipoteca'
    installments?: number
    down_payment?: number
    monthly?: number
    bank?: string
    notes?: string
  }
  status: 'Activo' | 'No Interesado' | 'Pausado'
  discard_reason?: string
  discarded_at?: string
}

export interface DealNote {
  id: string
  text: string
  timestamp: string
  author?: string
}

export interface Deal {
  id: string
  property_id: string
  lead_id: string
  stage: 'Nuevo' | 'Contactado' | 'Visita' | 'Negociacion' | 'Cierre' | 'Cancelado'
  value: number
  probability: number
  expected_close: string
  last_update: string
  title: string
  notes?: DealNote[]
}

export interface Visit {
  id: string
  property_id: string
  lead_id: string
  date: string
  time: string
  status: 'Programada' | 'Completada' | 'Cancelada'
  agent: string
  notes: string
}

export interface Agent {
  id: string
  name: string
  role: 'Gerente' | 'Asesor Senior' | 'Asesor'
  avatar?: string
  active_deals: number
  closed_deals: number
  revenue: number
  email: string
  phone?: string
  dni?: string
}

export interface Document {
  id: string
  type: 'Contrato' | 'Escritura' | 'Plano' | 'Título' | 'Avalúo'
  property_id: string
  lead_id?: string
  status: 'Borrador' | 'Enviado' | 'Firmado' | 'Expirado'
  updated_at: string
  name: string
}

export interface Task {
  id: string
  title: string
  due_date: string
  priority: 'Alta' | 'Media' | 'Baja'
  status: 'Pendiente' | 'Completada'
  assigned_to?: string
}

export interface WhatsAppMessage {
  id: string
  text: string
  sender: 'agent' | 'client'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

interface UIState {
  sidebarCollapsed: boolean
  activePage: string
  selectedProperty: string | null
  darkMode: boolean
  modals: {
    newLead: boolean
    addProperty: boolean
    scheduleVisit: boolean
    confirmDelete: boolean
  }
}

interface Store {
  properties: Property[]
  leads: Lead[]
  deals: Deal[]
  visits: Visit[]
  agents: Agent[]
  documents: Document[]
  tasks: Task[]
  whatsappChats: Record<string, WhatsAppMessage[]>
  ui: UIState
  toasts: { id: string; title: string; description?: string; variant?: 'default' | 'success' | 'error' }[]
  toggleSidebar: () => void
  setActivePage: (page: string) => void
  setSelectedProperty: (id: string | null) => void
  toggleDarkMode: () => void
  openModal: (modal: keyof UIState['modals']) => void
  closeModal: (modal: keyof UIState['modals']) => void
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  updateLeadPayment: (id: string, config: Lead['payment_config']) => void
  discardLead: (id: string, reason: string, notes?: string) => void
  reactivateLead: (id: string) => void
  addProperty: (property: Omit<Property, 'id'>) => void
  updateProperty: (id: string, property: Partial<Property>) => void
  deleteProperty: (id: string) => void
  archiveProperty: (id: string) => void
  addAgent: (agent: Omit<Agent, 'id'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  addDeal: (deal: Omit<Deal, 'id'>) => void
  updateDeal: (id: string, deal: Partial<Deal>) => void
  moveDeal: (id: string, stage: Deal['stage']) => void
  addDealNote: (dealId: string, text: string, author?: string) => void
  addVisit: (visit: Omit<Visit, 'id'>) => void
  updateVisit: (id: string, visit: Partial<Visit>) => void
  addDocument: (doc: Omit<Document, 'id'>) => void
  updateDocument: (id: string, doc: Partial<Document>) => void
  deleteDocument: (id: string) => void
  sendDocument: (id: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  sendWhatsAppMessage: (leadId: string, text: string) => void
  addToast: (toast: Omit<Store['toasts'][0], 'id'>) => void
  removeToast: (id: string) => void
}

const mockProperties: Property[] = [
  { id: '1', title: 'Casa en Palermo Soho', type: 'Casa', price: 45000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Palermo Soho', area_m2: 280, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-01-15', views: 342, interested: 28 },
  { id: '2', title: 'Departamento en Recoleta', type: 'Departamento', price: 32000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Recoleta', area_m2: 145, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-02-20', views: 256, interested: 19 },
  { id: '3', title: 'Oficina en Catalinas', type: 'Oficina', price: 58000000, status: 'Reservado', city: 'Buenos Aires', neighborhood: 'Catalinas', area_m2: 420, bedrooms: 0, bathrooms: 2, photos: [], created_at: '2024-03-05', views: 189, interested: 12 },
  { id: '4', title: 'Casa en Nordelta', type: 'Casa', price: 89000000, status: 'Disponible', city: 'Tigre', neighborhood: 'Nordelta', area_m2: 520, bedrooms: 5, bathrooms: 4, photos: [], created_at: '2024-01-28', views: 567, interested: 45 },
  { id: '5', title: 'Terreno en Pinamar', type: 'Terreno', price: 18000000, status: 'Disponible', city: 'Pinamar', neighborhood: 'Centro', area_m2: 1200, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-04-10', views: 123, interested: 8 },
  { id: '6', title: 'Departamento en Puerto Madero', type: 'Departamento', price: 72000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Puerto Madero', area_m2: 180, bedrooms: 3, bathrooms: 3, photos: [], created_at: '2024-02-14', views: 412, interested: 34 },
  { id: '7', title: 'Casa en Martínez', type: 'Casa', price: 55000000, status: 'Vendido', city: 'San Isidro', neighborhood: 'Martínez', area_m2: 340, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-01-05', views: 298, interested: 22 },
  { id: '8', title: 'Departamento en Belgrano', type: 'Departamento', price: 28000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Belgrano', area_m2: 95, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-22', views: 167, interested: 14 },
  { id: '9', title: 'Casa en Hudson', type: 'Casa', price: 38000000, status: 'Disponible', city: 'Berazategui', neighborhood: 'Hudson', area_m2: 260, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-02-08', views: 145, interested: 11 },
  { id: '10', title: 'Oficina en Dot', type: 'Oficina', price: 35000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Dot Baires', area_m2: 280, bedrooms: 0, bathrooms: 2, photos: [], created_at: '2024-04-01', views: 98, interested: 7 },
  { id: '11', title: 'Departamento en Almagro', type: 'Departamento', price: 22000000, status: 'Reservado', city: 'Buenos Aires', neighborhood: 'Almagro', area_m2: 72, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-15', views: 189, interested: 16 },
  { id: '12', title: 'Casa en La Plata', type: 'Casa', price: 28000000, status: 'Disponible', city: 'La Plata', neighborhood: 'City Bell', area_m2: 200, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-01-20', views: 112, interested: 9 },
  { id: '13', title: 'Terreno en Ezeiza', type: 'Terreno', price: 12000000, status: 'Disponible', city: 'Ezeiza', neighborhood: 'Canning', area_m2: 2500, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-04-05', views: 76, interested: 5 },
  { id: '14', title: 'Departamento en Caballito', type: 'Departamento', price: 19500000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Caballito', area_m2: 65, bedrooms: 2, bathrooms: 1, photos: [], created_at: '2024-03-28', views: 134, interested: 10 },
  { id: '15', title: 'Casa en Pilar', type: 'Casa', price: 62000000, status: 'Disponible', city: 'Pilar', neighborhood: 'Villa García', area_m2: 380, bedrooms: 4, bathrooms: 3, photos: [], created_at: '2024-02-25', views: 234, interested: 18 },
  { id: '16', title: 'Oficina en Núñez', type: 'Oficina', price: 42000000, status: 'Vendido', city: 'Buenos Aires', neighborhood: 'Núñez', area_m2: 220, bedrooms: 0, bathrooms: 1, photos: [], created_at: '2024-01-12', views: 167, interested: 13 },
  { id: '17', title: 'Casa en San Telmo', type: 'Casa', price: 48000000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'San Telmo', area_m2: 300, bedrooms: 4, bathrooms: 2, photos: [], created_at: '2024-03-01', views: 289, interested: 24 },
  { id: '18', title: 'Departamento en Flores', type: 'Departamento', price: 16500000, status: 'Disponible', city: 'Buenos Aires', neighborhood: 'Flores', area_m2: 58, bedrooms: 1, bathrooms: 1, photos: [], created_at: '2024-04-08', views: 89, interested: 6 },
  { id: '19', title: 'Terreno en Escobar', type: 'Terreno', price: 9500000, status: 'Disponible', city: 'Escobar', neighborhood: 'Belén de Escobar', area_m2: 1800, bedrooms: 0, bathrooms: 0, photos: [], created_at: '2024-02-18', views: 67, interested: 4 },
  { id: '20', title: 'Casa en Tigre Centro', type: 'Casa', price: 32000000, status: 'Disponible', city: 'Tigre', neighborhood: 'Tigre Centro', area_m2: 220, bedrooms: 3, bathrooms: 2, photos: [], created_at: '2024-03-10', views: 156, interested: 13 },
]

const mockLeads: Lead[] = [
  { id: '1', name: 'María González López', source: 'Web', phone: '+54 11 4567-8901', email: 'maria.gonzalez@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 85, status: 'Activo' as const, last_contact: '2024-04-15', budget: 50000000, notes: 'Interesada en casas de 4 ambientes en Palermo' },
  { id: '2', name: 'Carlos Rodríguez Fernández', source: 'Referido', phone: '+54 11 4567-8902', email: 'carlos.rodriguez@mail.com', stage: 'Visita', assigned_agent: '2', score: 72, status: 'Activo' as const, last_contact: '2024-04-14', budget: 35000000, notes: 'Busca departamento en Recoleta' },
  { id: '3', name: 'Ana Martínez Silva', source: 'Redes', phone: '+54 11 4567-8903', email: 'ana.martinez@mail.com', stage: 'Contactado', assigned_agent: '1', score: 65, last_contact: '2024-04-13', budget: 25000000, notes: 'Primera vivienda', status: 'Activo' as const },
  { id: '4', name: 'Pedro Sánchez Ruiz', source: 'Web', phone: '+54 11 4567-8904', email: 'pedro.sanchez@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 45, last_contact: '2024-04-12', budget: 40000000, notes: 'Inversionista', status: 'Activo' as const },
  { id: '5', name: 'Laura Hernández Vega', source: 'Expo', phone: '+54 11 4567-8905', email: 'laura.hernandez@mail.com', stage: 'Cierre', assigned_agent: '2', score: 95, last_contact: '2024-04-15', budget: 75000000, notes: 'Cierre próximo', status: 'Activo' as const },
  { id: '6', name: 'Miguel Torres Luna', source: 'Contacto', phone: '+54 11 4567-8906', email: 'miguel.torres@mail.com', stage: 'Visita', assigned_agent: '1', score: 78, last_contact: '2024-04-14', budget: 30000000, notes: 'Busca oficina en Catalinas', status: 'Activo' as const },
  { id: '7', name: 'Sofia Ramírez Ortega', source: 'Referido', phone: '+54 11 4567-8907', email: 'sofia.ramirez@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 88, last_contact: '2024-04-15', budget: 60000000, notes: 'Cliente de alto patrimonio', status: 'Activo' as const },
  { id: '8', name: 'Diego Morales Castro', source: 'Web', phone: '+54 11 4567-8908', email: 'diego.morales@mail.com', stage: 'Contactado', assigned_agent: '2', score: 55, last_contact: '2024-04-11', budget: 28000000, notes: 'Interesado en Nordelta', status: 'Activo' as const },
  { id: '9', name: 'Valentina Cruz Bravo', source: 'Redes', phone: '+54 11 4567-8909', email: 'valentina.cruz@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 40, last_contact: '2024-04-10', budget: 20000000, notes: 'Joven profesional', status: 'Activo' as const },
  { id: '10', name: 'Javier Flores Ríos', source: 'Expo', phone: '+54 11 4567-8910', email: 'javier.flores@mail.com', stage: 'Visita', assigned_agent: '1', score: 70, last_contact: '2024-04-14', budget: 45000000, notes: 'Família numerosa', status: 'Activo' as const },
  { id: '11', name: 'Lucia Navarro Jiménez', source: 'Referido', phone: '+54 11 4567-8911', email: 'lucia.navarro@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 82, last_contact: '2024-04-15', budget: 55000000, notes: 'Upgrade de vivienda', status: 'Activo' as const },
  { id: '12', name: 'Andrés Castro Molina', source: 'Web', phone: '+54 11 4567-8912', email: 'andres.castro@mail.com', stage: 'Contactado', assigned_agent: '2', score: 58, last_contact: '2024-04-12', budget: 32000000, notes: 'Busca terreno en Pinamar', status: 'Activo' as const },
  { id: '13', name: 'Carmen Delgado Peña', source: 'Contacto', phone: '+54 11 4567-8913', email: 'carmen.delgado@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 35, last_contact: '2024-04-09', budget: 15000000, notes: 'Presupuesto limitado', status: 'Activo' as const },
  { id: '14', name: 'Pablo Reyes Peña', source: 'Redes', phone: '+54 11 4567-8914', email: 'pablo.reyes@mail.com', stage: 'Visita', assigned_agent: '1', score: 75, last_contact: '2024-04-14', budget: 40000000, notes: 'Empresario', status: 'Activo' as const },
  { id: '15', name: 'Isabel Vargas Díaz', source: 'Referido', phone: '+54 11 4567-8915', email: 'isabel.vargas@mail.com', stage: 'Cierre', assigned_agent: '4', score: 92, last_contact: '2024-04-15', budget: 80000000, notes: 'Alta probabilidad de cierre', status: 'Activo' as const },
  { id: '16', name: 'Francisco Ruiz Sánchez', source: 'Expo', phone: '+54 11 4567-8916', email: 'francisco.ruiz@mail.com', stage: 'Contactado', assigned_agent: '2', score: 62, last_contact: '2024-04-13', budget: 38000000, notes: 'Busca departamento en Puerto Madero', status: 'Activo' as const },
  { id: '17', name: 'Elena Mendoza Rojas', source: 'Web', phone: '+54 11 4567-8917', email: 'elena.mendoza@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 48, last_contact: '2024-04-11', budget: 27000000, notes: 'Primera vivienda', status: 'Activo' as const },
  { id: '18', name: 'Antonio Herrera Gil', source: 'Contacto', phone: '+54 11 4567-8918', email: 'antonio.herrera@mail.com', stage: 'Visita', assigned_agent: '1', score: 68, last_contact: '2024-04-14', budget: 42000000, notes: 'Inversionista inmobiliario', status: 'Activo' as const },
  { id: '19', name: 'Patricia Luna Romero', source: 'Referido', phone: '+54 11 4567-8919', email: 'patricia.luna@mail.com', stage: 'Negociacion', assigned_agent: '4', score: 80, last_contact: '2024-04-15', budget: 52000000, notes: 'Upgrade a casa más grande', status: 'Activo' as const },
  { id: '20', name: 'Roberto Medina Ali', source: 'Redes', phone: '+54 11 4567-8920', email: 'roberto.medina@mail.com', stage: 'Contactado', assigned_agent: '2', score: 52, last_contact: '2024-04-12', budget: 29000000, notes: 'Busca en Martínez', status: 'Activo' as const },
  { id: '21', name: 'Mercedes Castro Gil', source: 'Web', phone: '+54 11 4567-8921', email: 'mercedes.castro@mail.com', stage: 'Nuevo', assigned_agent: '3', score: 38, last_contact: '2024-04-10', budget: 18000000, notes: 'Estudiante', status: 'Activo' as const },
  { id: '22', name: 'Daniel Ortega Vega', source: 'Expo', phone: '+54 11 4567-8922', email: 'daniel.ortega@mail.com', stage: 'Visita', assigned_agent: '1', score: 73, last_contact: '2024-04-14', budget: 35000000, notes: 'Matrimonio joven', status: 'Activo' as const },
  { id: '23', name: 'Sara Núñez Pérez', source: 'Referido', phone: '+54 11 4567-8923', email: 'sara.nunez@mail.com', stage: 'Contactado', assigned_agent: '4', score: 60, last_contact: '2024-04-13', budget: 33000000, notes: 'Busca en Pilar', status: 'Activo' as const },
  { id: '24', name: 'Gabriel Silva Díaz', source: 'Contacto', phone: '+54 11 4567-8924', email: 'gabriel.silva@mail.com', stage: 'Nuevo', assigned_agent: '2', score: 42, last_contact: '2024-04-11', budget: 22000000, notes: 'Primeros pasos', status: 'Activo' as const },
  { id: '25', name: 'Rosa María Torres', source: 'Web', phone: '+54 11 4567-8925', email: 'rosa.torres@mail.com', stage: 'Visita', assigned_agent: '3', score: 77, last_contact: '2024-04-14', budget: 48000000, notes: 'Busca casa con jardín', status: 'Activo' as const },
  { id: '26', name: 'Luis Fernando Moreno', source: 'Redes', phone: '+54 11 4567-8926', email: 'luis.moreno@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 86, last_contact: '2024-04-15', budget: 58000000, notes: 'Inversionista experimentado', status: 'Activo' as const },
  { id: '27', name: 'Adriana Herrera Soto', source: 'Referido', phone: '+54 11 4567-8927', email: 'adriana.herrera@mail.com', stage: 'Contactado', assigned_agent: '4', score: 56, last_contact: '2024-04-12', budget: 26000000, notes: 'Busca en San Telmo', status: 'Activo' as const },
  { id: '28', name: 'Ricardo Vázquez Roca', source: 'Expo', phone: '+54 11 4567-8928', email: 'ricardo.vazquez@mail.com', stage: 'Nuevo', assigned_agent: '2', score: 44, last_contact: '2024-04-10', budget: 19000000, notes: 'Joven profesional', status: 'Activo' as const },
  { id: '29', name: 'Natalia Paredes Soto', source: 'Web', phone: '+54 11 4567-8929', email: 'natalia.paredes@mail.com', stage: 'Visita', assigned_agent: '3', score: 71, last_contact: '2024-04-14', budget: 44000000, notes: 'Família con hijos', status: 'Activo' as const },
  { id: '30', name: 'Fernando Ruiz Gil', source: 'Contacto', phone: '+54 11 4567-8930', email: 'fernando.ruiz@mail.com', stage: 'Negociacion', assigned_agent: '1', score: 84, last_contact: '2024-04-15', budget: 56000000, notes: 'Cierre en proceso', status: 'Activo' as const },
]

const mockDeals: Deal[] = [
  { id: '1', property_id: '1', lead_id: '1', stage: 'Negociacion', value: 45000000, probability: 75, expected_close: '2024-05-15', last_update: '2024-04-15', title: 'Casa Palermo Soho - María González' },
  { id: '2', property_id: '2', lead_id: '2', stage: 'Visita', value: 32000000, probability: 45, expected_close: '2024-06-01', last_update: '2024-04-14', title: 'Dept Recoleta - Carlos Rodríguez' },
  { id: '3', property_id: '4', lead_id: '5', stage: 'Cierre', value: 89000000, probability: 95, expected_close: '2024-04-20', last_update: '2024-04-15', title: 'Casa Nordelta - Laura Hernández' },
  { id: '4', property_id: '3', lead_id: '6', stage: 'Negociacion', value: 58000000, probability: 70, expected_close: '2024-05-30', last_update: '2024-04-14', title: 'Oficina Catalinas - Miguel Torres' },
  { id: '5', property_id: '6', lead_id: '7', stage: 'Negociacion', value: 72000000, probability: 80, expected_close: '2024-05-20', last_update: '2024-04-15', title: 'Dept Puerto Madero - Sofía Ramírez' },
  { id: '6', property_id: '7', lead_id: '15', stage: 'Cierre', value: 55000000, probability: 98, expected_close: '2024-04-18', last_update: '2024-04-15', title: 'Casa Martínez - Isabel Vargas' },
  { id: '7', property_id: '15', lead_id: '19', stage: 'Negociacion', value: 62000000, probability: 72, expected_close: '2024-05-25', last_update: '2024-04-15', title: 'Casa Pilar - Patricia Luna' },
  { id: '8', property_id: '9', lead_id: '22', stage: 'Visita', value: 38000000, probability: 50, expected_close: '2024-06-15', last_update: '2024-04-14', title: 'Casa Hudson - Daniel Ortega' },
  { id: '9', property_id: '17', lead_id: '26', stage: 'Negociacion', value: 48000000, probability: 78, expected_close: '2024-05-10', last_update: '2024-04-15', title: 'Casa San Telmo - Luis Moreno' },
  { id: '10', property_id: '10', lead_id: '14', stage: 'Visita', value: 35000000, probability: 55, expected_close: '2024-06-01', last_update: '2024-04-14', title: 'Oficina Dot - Pablo Reyes' },
  { id: '11', property_id: '11', lead_id: '25', stage: 'Negociacion', value: 22000000, probability: 68, expected_close: '2024-05-28', last_update: '2024-04-15', title: 'Dept Almagro - Rosa Torres' },
  { id: '12', property_id: '20', lead_id: '30', stage: 'Negociacion', value: 32000000, probability: 74, expected_close: '2024-05-22', last_update: '2024-04-15', title: 'Casa Tigre - Fernando Ruiz' },
  { id: '13', property_id: '5', lead_id: '12', stage: 'Contactado', value: 18000000, probability: 35, expected_close: '2024-07-01', last_update: '2024-04-12', title: 'Terreno Pinamar - Andrés Castro' },
  { id: '14', property_id: '8', lead_id: '8', stage: 'Contactado', value: 28000000, probability: 40, expected_close: '2024-06-20', last_update: '2024-04-11', title: 'Dept Belgrano - Diego Morales' },
  { id: '15', property_id: '1', lead_id: '10', stage: 'Visita', value: 45000000, probability: 60, expected_close: '2024-06-10', last_update: '2024-04-14', title: 'Casa Palermo - Javier Flores' },
]

const mockVisits: Visit[] = [
  { id: '1', property_id: '1', lead_id: '1', date: '2024-04-16', time: '10:00', status: 'Programada', agent: '1', notes: 'Primera visita con la cliente' },
  { id: '2', property_id: '2', lead_id: '2', date: '2024-04-16', time: '14:30', status: 'Programada', agent: '2', notes: 'Cliente prospecto' },
  { id: '3', property_id: '4', lead_id: '5', date: '2024-04-17', time: '11:00', status: 'Programada', agent: '4', notes: 'Visita final antes del cierre' },
  { id: '4', property_id: '6', lead_id: '7', date: '2024-04-17', time: '16:00', status: 'Programada', agent: '1', notes: 'Segunda visita' },
  { id: '5', property_id: '9', lead_id: '22', date: '2024-04-18', time: '09:30', status: 'Programada', agent: '3', notes: 'Visita con familia' },
  { id: '6', property_id: '15', lead_id: '19', date: '2024-04-18', time: '15:00', status: 'Programada', agent: '4', notes: 'Cliente VIP' },
  { id: '7', property_id: '17', lead_id: '26', date: '2024-04-19', time: '10:30', status: 'Programada', agent: '1', notes: 'Pre-cierre' },
  { id: '8', property_id: '3', lead_id: '6', date: '2024-04-15', time: '11:00', status: 'Completada', agent: '2', notes: 'Visitado con éxito' },
  { id: '9', property_id: '7', lead_id: '15', date: '2024-04-14', time: '14:00', status: 'Completada', agent: '4', notes: 'Última visita antes del cierre' },
  { id: '10', property_id: '11', lead_id: '25', date: '2024-04-20', time: '12:00', status: 'Programada', agent: '3', notes: 'Primera visita' },
]

const mockAgents: Agent[] = [
  { id: '1', name: 'Roberto García', role: 'Gerente', active_deals: 5, closed_deals: 24, revenue: 245000000, email: 'roberto.garcia@siena.com' },
  { id: '2', name: 'María López', role: 'Asesor Senior', active_deals: 4, closed_deals: 18, revenue: 156000000, email: 'maria.lopez@siena.com' },
  { id: '3', name: 'Carlos Pérez', role: 'Asesor', active_deals: 3, closed_deals: 12, revenue: 89000000, email: 'carlos.perez@siena.com' },
  { id: '4', name: 'Ana Martínez', role: 'Asesor Senior', active_deals: 4, closed_deals: 20, revenue: 198000000, email: 'ana.martinez@siena.com' },
  { id: '5', name: 'Diego Fernández', role: 'Asesor', active_deals: 2, closed_deals: 8, revenue: 67000000, email: 'diego.fernandez@siena.com' },
  { id: '6', name: 'Lucía Rodríguez', role: 'Asesor', active_deals: 3, closed_deals: 10, revenue: 78000000, email: 'lucia.rodriguez@siena.com' },
  { id: '7', name: 'Miguel Torres', role: 'Asesor', active_deals: 2, closed_deals: 6, revenue: 45000000, email: 'miguel.torres@siena.com' },
  { id: '8', name: 'Sofia Herrera', role: 'Asesor Senior', active_deals: 3, closed_deals: 15, revenue: 134000000, email: 'sofia.herrera@siena.com' },
]

const mockDocuments: Document[] = [
  { id: '1', type: 'Contrato', property_id: '1', lead_id: '1', status: 'Enviado', updated_at: '2024-04-14', name: 'Contrato de compraventa - María González' },
  { id: '2', type: 'Escritura', property_id: '7', lead_id: '15', status: 'Firmado', updated_at: '2024-04-15', name: 'Escritura Casa Martínez' },
  { id: '3', type: 'Plano', property_id: '3', status: 'Enviado', updated_at: '2024-04-12', name: 'Planos Oficina Catalinas' },
  { id: '4', type: 'Título', property_id: '4', status: 'Borrador', updated_at: '2024-04-10', name: 'Título Casa Nordelta' },
  { id: '5', type: 'Avalúo', property_id: '6', status: 'Firmado', updated_at: '2024-04-15', name: 'Avalúo Puerto Madero' },
  { id: '6', type: 'Contrato', property_id: '9', lead_id: '22', status: 'Borrador', updated_at: '2024-04-13', name: 'Contrato Casa Hudson' },
  { id: '7', type: 'Escritura', property_id: '2', status: 'Expirado', updated_at: '2024-03-15', name: 'Escritura Dept Recoleta' },
  { id: '8', type: 'Contrato', property_id: '15', lead_id: '19', status: 'Enviado', updated_at: '2024-04-14', name: 'Contrato Casa Pilar' },
  { id: '9', type: 'Plano', property_id: '10', status: 'Firmado', updated_at: '2024-04-12', name: 'Planos Oficina Dot' },
  { id: '10', type: 'Título', property_id: '17', status: 'Borrador', updated_at: '2024-04-11', name: 'Título Casa San Telmo' },
  { id: '11', type: 'Avalúo', property_id: '11', status: 'Enviado', updated_at: '2024-04-14', name: 'Avalúo Dept Almagro' },
  { id: '12', type: 'Contrato', property_id: '20', lead_id: '30', status: 'Enviado', updated_at: '2024-04-15', name: 'Contrato Casa Tigre' },
]

const mockTasks: Task[] = [
  { id: '1', title: 'Llamar a Juan', due_date: '2024-04-16', priority: 'Alta', status: 'Pendiente', assigned_to: '1' },
  { id: '2', title: 'Enviar contrato a María', due_date: '2024-04-17', priority: 'Media', status: 'Pendiente', assigned_to: '2' },
  { id: '3', title: 'Enviar avaluo a cliente Nordelta', due_date: '2024-04-18', priority: 'Media', status: 'Pendiente', assigned_to: '2' },
  { id: '4', title: 'Programar visita Casa Palermo', due_date: '2024-04-19', priority: 'Media', status: 'Pendiente', assigned_to: '1' },
  { id: '5', title: 'Actualizar estado leads en CRM', due_date: '2024-04-20', priority: 'Baja', status: 'Pendiente', assigned_to: '3' },
  { id: '6', title: 'Revisar contratos pendientes', due_date: '2024-04-21', priority: 'Media', status: 'Pendiente', assigned_to: '4' },
  { id: '7', title: 'Contactar referidos expo', due_date: '2024-04-22', priority: 'Baja', status: 'Pendiente', assigned_to: '2' },
  { id: '8', title: 'Preparar presentación nuevos proyectos', due_date: '2024-04-23', priority: 'Alta', status: 'Pendiente', assigned_to: '1' },
]

export const useStore = create<Store>((set) => ({
  properties: mockProperties,
  leads: mockLeads,
  deals: mockDeals,
  visits: mockVisits,
  agents: mockAgents,
  documents: mockDocuments,
  tasks: mockTasks,
  whatsappChats: {
    '1': [
      { id: 'msg-1', text: '¡Hola Juan! Soy tu asesor de Grupo Siena. Vi que estuviste interesado en la casa en Palermo.', sender: 'agent', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'read' },
      { id: 'msg-2', text: 'Hola, sí, me gustaría saber si el precio es negociable.', sender: 'client', timestamp: new Date(Date.now() - 3000000).toISOString(), status: 'read' }
    ],
    '2': [
      { id: 'msg-3', text: 'María, ¿cómo estás? Te adjunto la información del departamento que visitamos.', sender: 'agent', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'read' }
    ]
  },
  ui: {
    sidebarCollapsed: false,
    activePage: 'overview',
    selectedProperty: null,
    darkMode: false,
    modals: {
      newLead: false,
      addProperty: false,
      scheduleVisit: false,
      confirmDelete: false,
    },
  },
  toasts: [],
  toggleSidebar: () => set((state) => ({
    ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
  })),
  setActivePage: (page) => set((state) => ({
    ui: { ...state.ui, activePage: page }
  })),
  setSelectedProperty: (id) => set((state) => ({
    ui: { ...state.ui, selectedProperty: id }
  })),
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.ui.darkMode
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { ui: { ...state.ui, darkMode: newDarkMode } }
  }),
  openModal: (modal) => set((state) => ({
    ui: { ...state.ui, modals: { ...state.ui.modals, [modal]: true } }
  })),
  closeModal: (modal) => set((state) => ({
    ui: { ...state.ui, modals: { ...state.ui.modals, [modal]: false } }
  })),
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
  })),
  addProperty: (property) => set((state) => ({
    properties: [...state.properties, { ...property, id: String(state.properties.length + 1) }]
  })),
  updateProperty: (id, updates) => set((state) => ({
    properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProperty: (id) => set((state) => ({
    properties: state.properties.filter(p => p.id !== id)
  })),
  archiveProperty: (id) => set((state) => ({
    properties: state.properties.map(p => p.id === id ? { ...p, status: 'Vendido' as const } : p)
  })),
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, { ...agent, id: String(Date.now()) }]
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id)
  })),
  addDeal: (deal) => set((state) => ({
    deals: [...state.deals, { ...deal, id: String(Date.now()) }]
  })),
  updateDeal: (id, updates) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  moveDeal: (id, stage) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, stage, last_update: new Date().toISOString().split('T')[0] } : d)
  })),
  addDealNote: (dealId, text, author) => set((state) => ({
    deals: state.deals.map(d => {
      if (d.id !== dealId) return d
      const newNote: DealNote = {
        id: String(Date.now()),
        text,
        timestamp: new Date().toISOString(),
        author
      }
      return { ...d, notes: [...(d.notes || []), newNote] }
    })
  })),
  addVisit: (visit) => set((state) => ({
    visits: [...state.visits, { ...visit, id: String(state.visits.length + 1) }]
  })),
  updateVisit: (id, updates) => set((state) => ({
    visits: state.visits.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  addDocument: (doc) => set((state) => ({
    documents: [...state.documents, { ...doc, id: String(state.documents.length + 1) }]
  })),
  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  sendDocument: (id) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, status: 'Enviado', updated_at: new Date().toISOString().split('T')[0] } : d)
  })),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: String(state.tasks.length + 1) }]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  sendWhatsAppMessage: (leadId, text) => set((state) => {
    const chat = state.whatsappChats[leadId] || []
    const newMsg: WhatsAppMessage = {
      id: String(Date.now()),
      text,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    return {
      whatsappChats: {
        ...state.whatsappChats,
        [leadId]: [...chat, newMsg]
      }
    }
  }),
  addToast: (toast) => set((state) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setTimeout(() => {
      useStore.getState().removeToast(id)
    }, 4000)
    return { toasts: [...state.toasts, newToast] }
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))
