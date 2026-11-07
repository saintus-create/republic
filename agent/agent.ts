import { defineAgent } from "eve";

export default defineAgent({
  limits: {
    maxInputTokensPerSession: 300_000,
  },
  model: process.env.EVE_MODEL ?? "openai/gpt-4o-mini",
});
