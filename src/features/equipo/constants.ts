export const roleColors: Record<string, 'default' | 'warning' | 'secondary'> = {
  GENERAL_MANAGER: 'warning',
  COMMERCIAL_MANAGER: 'warning',
  INTERNAL_ADVISOR: 'default',
  EXTERNAL_ADVISOR: 'secondary',
  'Gerente': 'warning',
  'Asesor Senior': 'default',
  'Asesor': 'secondary',
}

export const roleGradients: Record<string, string> = {
  GENERAL_MANAGER: 'from-warning-500/20 to-warning-500/5',
  COMMERCIAL_MANAGER: 'from-warning-500/20 to-warning-500/5',
  INTERNAL_ADVISOR: 'from-primary/20 to-primary/5',
  EXTERNAL_ADVISOR: 'from-secondary/20 to-secondary/5',
  'Gerente': 'from-warning-500/20 to-warning-500/5',
  'Asesor Senior': 'from-primary/20 to-primary/5',
  'Asesor': 'from-secondary/20 to-secondary/5',
}

