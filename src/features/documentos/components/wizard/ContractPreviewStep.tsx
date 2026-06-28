import React from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Lead, Property, Deal } from '@/store'
import type { WizardData } from '../../types'

// Re-declare or import context type to access shared state.
// Since we want to keep it simple, we can pass props or share the context.
// Let's import the context hooks or pass the values directly as props for clean boundaries.
interface ContractPreviewStepProps {
  wizardData: WizardData
  docRef: string
  currentDate: string
  selectedLead?: Lead
  selectedProp?: Property
  selectedDeal?: Deal
  handlePrint: () => void
}

export function ContractPreviewStep({
  wizardData,
  docRef,
  currentDate,
  selectedLead,
  selectedProp,
  selectedDeal,
  handlePrint,
}: ContractPreviewStepProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="print:hidden flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg font-heading text-neutral-800">Paso 3: Vista Previa</h3>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Imprimir / PDF
        </Button>
      </div>
      <div className="border border-neutral-200 p-8 md:p-12 bg-white text-black font-serif text-justify print:border-none print:p-0 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm print:shadow-none">
        <div className="flex justify-between items-start mb-12">
          <img src="/logo.png" alt="Grupo Siena" className="h-16 object-contain" />
          <div className="text-right text-sm text-gray-500 font-sans">
            <p className="font-bold">CONTRATO DE {wizardData.type.toUpperCase()}</p>
            <p>Nº Ref: {docRef}</p>
            <p>Fecha: {currentDate}</p>
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-8 uppercase underline decoration-double underline-offset-4">
          CONTRATO DE {wizardData.type === 'compra' ? 'COMPRAVENTA' : 'ARRENDAMIENTO'} INMOBILIARIO
        </h1>
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Entre <strong>GRUPO SIENA INMOBILIARIA</strong>, en adelante EL {wizardData.type === 'compra' ? 'VENDEDOR' : 'LOCADOR'},
            y por la otra parte <strong>{selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}`.trim().toUpperCase() : ''}</strong>, con DNI ________________,
            email: {selectedLead?.email}, teléfono: {selectedLead?.phone}, en adelante EL {wizardData.type === 'compra' ? 'COMPRADOR' : 'LOCATARIO'},
            se conviene celebrar el presente contrato sujeto a las siguientes cláusulas:
          </p>
          <p>
            <strong>PRIMERA (OBJETO):</strong> EL {wizardData.type === 'compra' ? 'VENDEDOR' : 'LOCADOR'} entrega
            al {wizardData.type === 'compra' ? 'COMPRADOR' : 'LOCATARIO'} el inmueble tipo <strong>{selectedProp?.type}</strong>,
            ubicado en la ciudad de <strong>{selectedProp?.city}</strong>, barrio <strong>{selectedProp?.neighborhood}</strong>,
            con una superficie de {selectedProp?.area_m2} m².
          </p>
          <p>
            <strong>SEGUNDA (PRECIO Y FORMA DE PAGO):</strong> El precio convenido por la operación se fija en la suma de
            <strong> {formatCurrency(selectedDeal?.value || selectedProp?.price || 0)}</strong>.
            {selectedLead?.payment_config?.type === 'cuotas'
              ? ` La operación se realizará en cuotas, con un anticipo de ${formatCurrency(selectedLead.payment_config.down_payment || 0)} y el resto en ${selectedLead.payment_config.installments} cuotas.`
              : selectedLead?.payment_config?.type === 'hipoteca'
                ? ` La operación se realizará mediante crédito hipotecario del banco ${selectedLead.payment_config.bank}.`
                : ' La operación se realizará al contado en su totalidad.'}
          </p>
          <p>
            <strong>TERCERA (CONDICIONES):</strong> El inmueble se entrega en el estado en que se encuentra, libre de ocupantes
            y con los impuestos al día. Las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad
            para cualquier divergencia originada en el presente contrato.
          </p>
          <div className="pt-24 flex justify-between px-12">
            <div className="text-center">
              <div className="border-t border-black w-48 mb-2" />
              <p className="font-bold">GRUPO SIENA</p>
              <p className="text-xs">Representante Legal</p>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-48 mb-2" />
              <p className="font-bold">{selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}`.trim().toUpperCase() : ''}</p>
              <p className="text-xs">DNI: ________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
