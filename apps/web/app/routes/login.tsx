import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Public access - redirect to home page.
 * This route is kept for compatibility but redirects to the main chat.
 */
export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }).partial(),
  beforeLoad: async ({ search }) => {
    // Public site - always redirect to home
    throw redirect({ href: search.redirect ?? "/" });
  },
  component: () => null,
});
