import { createFileRoute } from '@tanstack/react-router'
import Eventos from '@/features/actividad11/components/Eventos'

export const Route = createFileRoute('/ActividadesSeminarioSO/actividad11/eventos')({
  component: Eventos,
})
