import { createRootRoute, Outlet } from "@tanstack/react-router";
import "../style.css";

export const Route = createRootRoute({
  component: () => <Outlet />,
});
