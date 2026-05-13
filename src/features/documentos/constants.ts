import type { DocType, DocStatus } from './types'

export const DOC_TYPES: DocType[] = ['Contrato', 'Escritura', 'Plano', 'Título', 'Avalúo']
export const DOC_STATUSES: DocStatus[] = ['Borrador', 'Enviado', 'Firmado', 'Expirado']

export const typeIcons: Record<DocType, string> = {
  Contrato: '📄',
  Escritura: '📜',
  Plano: '🗺️',
  Título: '📋',
  Avalúo: '💰',
}

export const statusVariants: Record<DocStatus, 'default' | 'success' | 'warning' | 'error' | 'outline'> = {
  Borrador: 'outline',
  Enviado: 'warning',
  Firmado: 'success',
  Expirado: 'error',
}
