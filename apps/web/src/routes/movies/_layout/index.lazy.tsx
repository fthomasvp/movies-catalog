import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/movies/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/movies/"!</div>
}
