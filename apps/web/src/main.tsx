import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@rewee/ui/styles.css"
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
