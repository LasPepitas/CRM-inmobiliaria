import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeletePropertyDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeletePropertyDialog({ open, onClose, onConfirm }: DeletePropertyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar propiedad?</DialogTitle>
        </DialogHeader>
        <p className="text-neutral-600 py-4">
          Esta acción no se puede deshacer. La propiedad y todos sus datos asociados serán eliminados permanentemente.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
