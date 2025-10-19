import { createFileRoute } from '@tanstack/react-router'
import BloqueosInnecesarios from '@/features/actividad11/components/BloqueosInnecesarios'

export const Route = createFileRoute('/actividad11/bloqueos-innecesarios')({
  component: BloqueosInnecesarios,
})
