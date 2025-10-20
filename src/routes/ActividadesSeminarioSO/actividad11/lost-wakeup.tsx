import { createFileRoute } from '@tanstack/react-router'
import LostWakeup from '@/features/actividad11/components/LostWakeup';

export const Route = createFileRoute('/ActividadesSeminarioSO/actividad11/lost-wakeup')({
  component: LostWakeup,
})