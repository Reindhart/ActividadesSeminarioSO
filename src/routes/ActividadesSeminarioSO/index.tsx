import { createFileRoute } from '@tanstack/react-router';
import Inicio from '@/features/inicio';

export const Route = createFileRoute('/ActividadesSeminarioSO/')({
  component: Inicio,
});
