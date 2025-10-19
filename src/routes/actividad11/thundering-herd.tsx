import { createFileRoute } from '@tanstack/react-router'
import ThunderingHerd from '@/features/actividad11/components/ThunderingHerd';

export const Route = createFileRoute('/actividad11/thundering-herd')({
  component: ThunderingHerd,
})