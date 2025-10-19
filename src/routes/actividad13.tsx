import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/actividad13')({
  component: Actividad13Component,
});

function Actividad13Component() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-4xl font-bold mb-4">Actividad 13</h1>
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Esta actividad estará disponible próximamente.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
