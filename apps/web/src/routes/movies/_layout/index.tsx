import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies/_layout/")({
  loader: async (_opts) => {
    // Simulate loading time
    await new Promise((r) => setTimeout(r, 500));

    const response = await fetch("http://localhost:8080/api/v1/movies/s111");
    const data = await response.json();

    return await data;
  },
  pendingComponent: () => <>LOADING...</>,
});
