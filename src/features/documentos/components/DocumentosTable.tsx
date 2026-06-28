import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Download, Send, Trash2, CheckCircle, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { typeIcons, statusVariants } from '../constants'
import type { ApiDocument } from '../adapters/documentosAdapter'

interface DocumentosTableProps {
  documents: ApiDocument[]
  isLoading: boolean
  getPropertyTitle: (id: string) => string
  getLeadName: (id: string | null | undefined) => string
  handleDownloadDocument: (id: string) => void
  handleSendDocument: (id: string) => void
  handleSignDocument: (id: string) => void
  handleDeleteDocument: (id: string) => void
  onEdit: (doc: ApiDocument) => void
}

function DocumentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-neutral-200 shrink-0" />
              <div className="h-3.5 w-40 bg-neutral-200 rounded" />
            </div>
          </TableCell>
          <TableCell><div className="h-5 w-20 bg-neutral-200 rounded-full" /></TableCell>
          <TableCell><div className="h-3 w-32 bg-neutral-100 rounded" /></TableCell>
          <TableCell><div className="h-3 w-24 bg-neutral-100 rounded" /></TableCell>
          <TableCell><div className="h-5 w-16 bg-neutral-200 rounded-full" /></TableCell>
          <TableCell><div className="h-3 w-20 bg-neutral-100 rounded" /></TableCell>
          <TableCell><div className="h-7 w-7 bg-neutral-100 rounded ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function DocumentosTable({
  documents,
  isLoading,
  getPropertyTitle,
  getLeadName,
  handleDownloadDocument,
  handleSendDocument,
  handleSignDocument,
  handleDeleteDocument,
  onEdit,
}: DocumentosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Documento</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Propiedad</TableHead>
          <TableHead>Lead</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Actualizado</TableHead>
          <TableHead className="w-[60px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && documents.length === 0 ? (
          <DocumentTableSkeleton />
        ) : documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-32 text-center text-neutral-400">
              No hay documentos que coincidan con los filtros
            </TableCell>
          </TableRow>
        ) : (
          documents.map(doc => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center text-xl shrink-0">
                    {typeIcons[doc.type] || '📄'}
                  </div>
                  <span className="font-medium">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{doc.type}</Badge>
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">{getPropertyTitle(doc.property_id)}</TableCell>
              <TableCell className="text-neutral-600 text-sm">{getLeadName(doc.leadId)}</TableCell>
              <TableCell>
                <Badge variant={statusVariants[doc.status]}>{doc.status}</Badge>
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">{formatDate(doc.updated_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(doc)}>
                      <Pencil className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadDocument(doc.id)}>
                      <Download className="h-4 w-4 mr-2" /> Descargar
                    </DropdownMenuItem>
                    {doc.status === 'Borrador' && (
                      <DropdownMenuItem onClick={() => handleSendDocument(doc.id)}>
                        <Send className="h-4 w-4 mr-2" /> Enviar
                      </DropdownMenuItem>
                    )}
                    {doc.status === 'Enviado' && (
                      <DropdownMenuItem onClick={() => handleSignDocument(doc.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> Marcar Firmado
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)} className="text-error-500">
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
