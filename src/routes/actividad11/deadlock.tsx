import { createFileRoute } from '@tanstack/react-router';
import Deadlock from '@/features/actividad11/components/Deadlock';

export const Route = createFileRoute('/actividad11/deadlock')({
  component: Deadlock,
});
