import { Button } from "@rewee/ui";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button intent={"solid"} size={"large"}>
        Solid Lg Btn
      </Button>
    </div>
  );
}
