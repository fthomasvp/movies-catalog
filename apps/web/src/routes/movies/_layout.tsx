import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/movies/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-slate-700 text-white">
      Hello "/movies/_layout"!
      <Outlet />
    </div>
  )
}
