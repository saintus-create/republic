import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: 
    "Get a list of personal projects with details. Use this to show portfolio items.",
  inputSchema: z.object({
    category: z
      .string()
      .describe(
        "Filter by category: 'ai', 'web', 'mobile', 'open-source', 'experimental', or leave empty for all."
      )
      .default(""),
    limit: z
      .number()
      .describe("Maximum number of projects to return.")
      .default(10),
  }),
  execute({ category, limit }) {
    const allProjects = [
      {
        id: "ai-chat-app",
        name: "AI Chat Application",
        description: 
          "A full-featured AI chat application with support for multiple models, conversation history, and generative UI components.",
        category: "ai",
        tags: ["AI", "Chat", "React", "TypeScript"],
        url: "#",
        status: "active",
        featured: true,
      },
      {
        id: "personal-website",
        name: "This Website",
        description: 
          "My personal website and portfolio built with TanStack Start and eve. Features an AI assistant that can answer questions about my work.",
        category: "web",
        tags: ["Personal", "Portfolio", "AI", "TanStack"],
        url: "/",
        status: "active",
        featured: true,
      },
      {
        id: "knowledge-base",
        name: "Knowledge Base",
        description: 
          "AI-powered knowledge management system for organizing and querying personal notes and documents.",
        category: "ai",
        tags: ["AI", "Knowledge", "RAG", "Vector DB"],
        url: "#",
        status: "in-development",
        featured: false,
      },
      {
        id: "api-wrapper",
        name: "API Wrapper Library",
        description: 
          "Type-safe wrapper for various API services with built-in rate limiting and caching.",
        category: "open-source",
        tags: ["TypeScript", "API", "Library"],
        url: "#",
        status: "active",
        featured: false,
      },
      {
        id: "dev-tools-cli",
        name: "Dev Tools CLI",
        description: 
          "Command-line toolkit for developers including code generators, linters, and automation scripts.",
        category: "open-source",
        tags: ["CLI", "Developer Tools", "Productivity"],
        url: "#",
        status: "active",
        featured: false,
      },
      {
        id: "experimental-ai",
        name: "Experimental AI",
        description: 
          "Playground for testing new AI concepts, models, and integrations.",
        category: "experimental",
        tags: ["AI", "Experiments", "Research"],
        url: "#",
        status: "experimental",
        featured: false,
      },
    ];

    let projects = allProjects;

    if (category) {
      projects = projects.filter((p) => p.category === category);
    }

    if (limit && limit > 0) {
      projects = projects.slice(0, limit);
    }

    return {
      total: projects.length,
      projects,
    };
  },
});
