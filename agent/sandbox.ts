import { defineSandbox } from "eve/sandbox";
import { JustBashSandbox } from "eve/sandbox/just-bash";

/** Sandbox environment: always just-bash, runs in-process on the sovereign server. */
export const environment = JustBashSandbox.environment({ autoInstall: false });

/**
 * Opens the session sandbox.
 *
 * @returns The opened sandbox for the configured environment.
 */
export default defineSandbox(async () => await environment.open());
