import { createMiddleware, createStart } from "@tanstack/react-start";

/** Passes every request through without modification. */
const passthrough = createMiddleware({ type: "request" }).server(
  async ({ next }) => await next()
);

/** The TanStack Start instance. */
export const startInstance = createStart(() => ({
  requestMiddleware: [passthrough],
}));
