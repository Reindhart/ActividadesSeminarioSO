import { createFileRoute } from '@tanstack/react-router'
import Livelock from '@/features/actividad11/components/Livelock';


export const Route = createFileRoute('/actividad11/livelock')({
  component: Livelock,
})