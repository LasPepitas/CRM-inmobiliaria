export const stageColors: Record<string, string> = {
  'NUEVO': 'bg-blue-500',
  'CONTACTADO': 'bg-cyan-500',
  'VISITA': 'bg-warning-500',
  'NEGOCIACION': 'bg-orange-500',
  'CIERRE': 'bg-success-500',
  'CANCELADO': 'bg-error-500',
}

export const sourceOptions = ['Web', 'Referido', 'Contacto', 'Redes', 'Expo'] as const

export const stageOptions = ['NUEVO', 'CONTACTADO', 'VISITA', 'NEGOCIACION', 'CIERRE'] as const
