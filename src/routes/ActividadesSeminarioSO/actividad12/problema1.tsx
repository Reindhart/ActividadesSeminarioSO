import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/ActividadesSeminarioSO/actividad12/problema1',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ActividadesSeminarioSO/actividad12/problema1"!</div>
}
