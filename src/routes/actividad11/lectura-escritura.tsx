import { createFileRoute } from '@tanstack/react-router';
import LecturaEscritura from '@/features/actividad11/components/LecturaEscritura';

export const Route = createFileRoute('/actividad11/lectura-escritura')({
  component: LecturaEscritura,
});
