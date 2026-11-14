import { createOpenAI } from "@ai-sdk/openai";
import { defineAgent } from "eve";

/**
 * Mistral via its OpenAI-compatible API endpoint.
 * Set MISTRAL_API_KEY and optionally MISTRAL_MODEL in the environment.
 */
const mistral = createOpenAI({
  name: "mistral",
  baseURL: "https://api.mistral.ai/v1",
  apiKey: process.env.MISTRAL_API_KEY ?? "",
});

export default defineAgent({
  limits: {
    maxInputTokensPerSession: 300_000,
  },
  model: mistral(process.env.MISTRAL_MODEL ?? "mistral-large-latest"),
});
