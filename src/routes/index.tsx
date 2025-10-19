import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

function RedirectToActividades() {
  useEffect(() => {
    // Use a hard redirect to avoid typing issues with the router's navigate API
    window.location.replace('/ActividadesSeminarioSO');
  }, []);
  return null;
}

// Root route redirects to /ActividadesSeminarioSO
export const Route = createFileRoute('/')({
  component: RedirectToActividades,
});
