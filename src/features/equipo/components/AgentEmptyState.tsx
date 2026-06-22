import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function AgentEmptyState() {
  return (
    <div className="col-span-3 py-16 text-center text-neutral-400">
      <Avatar className="h-16 w-16 mx-auto mb-4">
        <AvatarFallback className="text-2xl bg-neutral-100">?</AvatarFallback>
      </Avatar>
      <p className="font-medium text-neutral-500">No hay miembros que coincidan</p>
    </div>
  )
}
