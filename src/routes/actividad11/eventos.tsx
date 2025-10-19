import { createFileRoute } from '@tanstack/react-router'
import Eventos from '@/features/actividad11/components/Eventos'

export const Route = createFileRoute('/actividad11/eventos')({
  component: Eventos,
})
