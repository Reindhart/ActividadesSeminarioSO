import { createFileRoute } from '@tanstack/react-router';
import Inicio from '../features/inicio';

// Use createFileRoute without a literal argument and provide `path` in the route object
export const Route = createFileRoute()({
  component: Inicio,
});
