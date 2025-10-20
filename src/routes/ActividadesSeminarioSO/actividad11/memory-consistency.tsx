import { createFileRoute } from '@tanstack/react-router'
import MemoryConsistency from '@/features/actividad11/components/MemoryConsistency';

export const Route = createFileRoute('/ActividadesSeminarioSO/actividad11/memory-consistency')({
  component: MemoryConsistency,
})