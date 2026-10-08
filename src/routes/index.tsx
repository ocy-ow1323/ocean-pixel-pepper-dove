import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/cosmos/experience";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Experience />;
}
