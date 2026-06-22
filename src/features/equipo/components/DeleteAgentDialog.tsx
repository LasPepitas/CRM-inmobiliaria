import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface DeleteAgentDialogProps {
  open: boolean
  agentName?: string
  activeDeals: number
  agentLeads: number
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAgentDialog({ open, agentName, activeDeals, agentLeads, onClose, onConfirm }: DeleteAgentDialogProps) {
  const hasWarning = activeDeals > 0 || agentLeads > 0
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar miembro?</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-neutral-600">
            Estás por eliminar a <span className="font-semibold">{agentName}</span> del equipo.
          </p>
          {hasWarning && (
            <div className="p-3 rounded-lg bg-warning-500/10 border border-warning-500/30 text-sm text-warning-600">
              ⚠️ Este miembro tiene <strong>{activeDeals}</strong> negocios activos y <strong>{agentLeads}</strong> leads asignados. Al eliminarlo, quedarán sin asesor.
            </div>
          )}
          <p className="text-sm text-neutral-400">Esta acción no se puede deshacer.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
