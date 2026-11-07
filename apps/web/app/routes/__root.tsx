import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { getAccessStatus } from "@/app/access";
import { TooltipProvider } from "@/components/ui/tooltip";

import fontsCss from "../fonts.css?url";
import globalsCss from "../globals.css?url";

export const Route = createRootRoute({
  /**
   * Public access - no login required.
   * All visitors can access the chat directly.
   */
  beforeLoad: async ({ location }) => {
    // Always allow access - no authentication required
    return;
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Personal Assistant" },
      {
        name: "description",
        content: "My personal AI assistant - Ask me about my work, projects, or anything else.",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "stylesheet", href: fontsCss },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
