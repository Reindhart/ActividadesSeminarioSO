import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/actividad11')({
  component: () => <Outlet />,
});
