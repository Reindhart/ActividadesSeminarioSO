import { createFileRoute } from '@tanstack/react-router'
import PriorityInversion from '@/features/actividad11/components/PriorityInversion';

export const Route = createFileRoute('/ActividadesSeminarioSO/actividad11/priority-inversion')({
  component: PriorityInversion,
})