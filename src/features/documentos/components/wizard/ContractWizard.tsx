import { createContext, useContext, lazy, Suspense } from 'react'

const ContractPreviewStep = lazy(() =>
  import('./ContractPreviewStep').then(m => ({ default: m.ContractPreviewStep }))
)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Lead } from '@/features/leads/types'
import type { Property, Deal } from '@/store'
import type { WizardData } from '../../types'

interface ContractWizardContextType {
  wizardStep: number
  wizardData: WizardData
  setWizardStep: (step: number | ((prev: number) => number)) => void
  setWizardData: (data: WizardData | ((prev: WizardData) => WizardData)) => void
  leads: Lead[]
  properties: Property[]
  deals: Deal[]
  selectedLead?: Lead
  selectedDeal?: Deal
  selectedProp?: Property
  leadDeals: Deal[]
  docRef: string
  currentDate: string
  handlePrint: () => void
  handleFinishWizard: () => void
  onClose: () => void
}

const ContractWizardContext = createContext<ContractWizardContextType | null>(null)

function useContractWizardContext() {
  const context = useContext(ContractWizardContext)
  if (!context) {
    throw new Error('useContractWizardContext must be used within a ContractWizardProvider')
  }
  return context
}

interface ContractWizardProps {
  open: boolean
  onClose: () => void
  wizardStep: number
  wizardData: WizardData
  setWizardStep: (step: number | ((prev: number) => number)) => void
  setWizardData: (data: WizardData | ((prev: WizardData) => WizardData)) => void
  leads: Lead[]
  properties: Property[]
  deals: Deal[]
  selectedLead?: Lead
  selectedDeal?: Deal
  selectedProp?: Property
  leadDeals: Deal[]
  docRef: string
  currentDate: string
  handlePrint: () => void
  handleFinishWizard: () => void
}

export function ContractWizard({
  open,
  onClose,
  wizardStep,
  wizardData,
  setWizardStep,
  setWizardData,
  leads,
  properties,
  deals,
  selectedLead,
  selectedDeal,
  selectedProp,
  leadDeals,
  docRef,
  currentDate,
  handlePrint,
  handleFinishWizard,
}: ContractWizardProps) {
  const value: ContractWizardContextType = {
    wizardStep,
    wizardData,
    setWizardStep,
    setWizardData,
    leads,
    properties,
    deals,
    selectedLead,
    selectedDeal,
    selectedProp,
    leadDeals,
    docRef,
    currentDate,
    handlePrint,
    handleFinishWizard,
    onClose,
  }

  return (
    <ContractWizardContext.Provider value={value}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={wizardStep === 3 ? 'max-w-4xl max-h-[90vh] overflow-y-auto' : 'max-w-lg'}>
          <DialogHeader>
            <DialogTitle>Generador de Contratos</DialogTitle>
          </DialogHeader>

          {/* Progress bar */}
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= wizardStep ? 'bg-primary' : 'bg-neutral-100'}`} />
            ))}
          </div>

          {/* Render active step */}
          {wizardStep === 1 && <ContractWizard.Step1 />}
          {wizardStep === 2 && <ContractWizard.Step2 />}
          {wizardStep === 3 && (
            <Suspense fallback={<div className="py-8 text-center text-neutral-500 font-medium">Cargando vista previa...</div>}>
              <ContractPreviewStepWrapper />
            </Suspense>
          )}

          {/* Dialog Footer */}
          <DialogFooter className="print:hidden mt-4">
            {wizardStep > 1 && (
              <Button variant="outline" onClick={() => setWizardStep(s => s - 1)}>
                Atrás
              </Button>
            )}
            {wizardStep < 3 ? (
              <Button
                onClick={() => setWizardStep(s => s + 1)}
                disabled={
                  (wizardStep === 1 && !wizardData.lead_id) ||
                  (wizardStep === 2 && !wizardData.property_id && !wizardData.deal_id)
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleFinishWizard}>
                <CheckCircle className="h-4 w-4 mr-2" /> Guardar Contrato
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContractWizardContext.Provider>
  )
}

// STEP 1: Client Selection
ContractWizard.Step1 = function Step1() {
  const { wizardData, setWizardData, leads, selectedLead } = useContractWizardContext()

  return (
    <div className="space-y-4 py-4">
      <h3 className="font-semibold text-lg font-heading text-neutral-800">Paso 1: Seleccionar Cliente</h3>
      <div>
        <label className="text-sm font-medium text-neutral-700">Cliente (Lead) *</label>
        <Select
          value={wizardData.lead_id || '__none__'}
          onValueChange={v => setWizardData(prev => ({ ...prev, lead_id: v === '__none__' ? '' : v }))}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Seleccionar lead..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Seleccionar lead...</SelectItem>
            {leads.map(l => (
              <SelectItem key={l.id} value={l.id}>
                {`${l.firstName} ${l.lastName}`.trim()} — {l.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedLead && (
        <div className="bg-neutral-50 p-4 rounded-lg text-sm border border-neutral-100">
          <p className="font-semibold text-neutral-800 mb-1">Datos encontrados:</p>
          <p className="text-neutral-600"><span className="font-medium">Teléfono:</span> {selectedLead.phone}</p>
          <p className="text-neutral-600"><span className="font-medium">Email:</span> {selectedLead.email}</p>
          {selectedLead.payment_config && (
            <p className="text-neutral-600">
              <span className="font-medium">Pago:</span> {selectedLead.payment_config.type}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// STEP 2: Operation & Property
ContractWizard.Step2 = function Step2() {
  const { wizardData, setWizardData, deals, leadDeals, properties } = useContractWizardContext()

  return (
    <div className="space-y-4 py-4">
      <h3 className="font-semibold text-lg font-heading text-neutral-800">Paso 2: Operación y Propiedad</h3>
      <div>
        <label className="text-sm font-medium text-neutral-700">Tipo de Operación</label>
        <Select
          value={wizardData.type}
          onValueChange={v => setWizardData(prev => ({ ...prev, type: v as 'compra' | 'alquiler' }))}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compra">Compraventa</SelectItem>
            <SelectItem value="alquiler">Alquiler</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-neutral-700">Negocio vinculado (Opcional)</label>
        <Select
          value={wizardData.deal_id || '__none__'}
          onValueChange={v => {
            const deal = deals.find(d => d.id === v)
            setWizardData(prev => ({
              ...prev,
              deal_id: v === '__none__' ? '' : v,
              property_id: deal?.property_id || prev.property_id,
            }))
          }}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sin negocio específico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin negocio específico</SelectItem>
            {leadDeals.map(d => (
              <SelectItem key={d.id} value={d.id}>
                {d.title} ({formatCurrency(d.value)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!wizardData.deal_id && (
        <div>
          <label className="text-sm font-medium text-neutral-700">Propiedad *</label>
          <Select
            value={wizardData.property_id || '__none__'}
            onValueChange={v => setWizardData(prev => ({ ...prev, property_id: v === '__none__' ? '' : v }))}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Seleccionar propiedad..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Seleccionar propiedad...</SelectItem>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

function ContractPreviewStepWrapper() {
  const { wizardData, docRef, currentDate, selectedLead, selectedProp, selectedDeal, handlePrint } = useContractWizardContext()
  return (
    <ContractPreviewStep
      wizardData={wizardData}
      docRef={docRef}
      currentDate={currentDate}
      selectedLead={selectedLead}
      selectedProp={selectedProp}
      selectedDeal={selectedDeal}
      handlePrint={handlePrint}
    />
  )
}
