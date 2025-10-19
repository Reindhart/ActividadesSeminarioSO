import { createFileRoute } from '@tanstack/react-router'
import ABA from '@/features/actividad11/components/ABA';

export const Route = createFileRoute('/actividad11/aba')({
  component: ABA,
})