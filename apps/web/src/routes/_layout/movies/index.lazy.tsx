import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/movies/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/movies/"!</div>
}
