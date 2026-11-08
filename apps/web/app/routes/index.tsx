import { createFileRoute } from "@tanstack/react-router";

import { AgentChat } from "@/app/_components/agent-chat";
import { AffiliationsBento } from "@/components/affiliations-bento";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <AgentChat />
      <AffiliationsBento />
    </div>
  ),
});
