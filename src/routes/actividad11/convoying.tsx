import { createFileRoute } from '@tanstack/react-router'
import Convoying from '@/features/actividad11/components/Convoying';

export const Route = createFileRoute('/actividad11/convoying')({
  component: Convoying,
})