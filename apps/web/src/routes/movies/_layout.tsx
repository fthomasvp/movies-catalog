import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="max-w-7xl mx-auto px-7">
      <Outlet />
    </main>
  );
}
