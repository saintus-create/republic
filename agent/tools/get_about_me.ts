import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: 
    "Get detailed information about the site owner - bio, experience, skills, and contact info.",
  inputSchema: z.object({
    section: z
      .string()
      .describe(
        "Which section to retrieve: 'bio', 'experience', 'skills', 'projects', 'contact', or 'all'. Default is 'all'."
      )
      .default("all"),
  }),
  execute({ section }) {
    const aboutData = {
      bio: {
        name: "Personal Site Owner",
        title: "Software Developer & AI Enthusiast",
        summary: 
          "I build intelligent applications and developer tools. I'm passionate about AI, open source, and creating software that makes a difference.",
        location: "Building from the digital world",
        tagline: "Turning ideas into intelligent applications.",
      },
      experience: {
        current: "Full-Stack Developer & AI Builder",
        focus: [
          "AI/ML integrations",
          "Web applications",
          "Developer tools",
          "Open source contributions",
        ],
        years: "5+ years of building",
      },
      skills: {
        languages: ["TypeScript", "Python", "JavaScript", "Rust", "Go"],
        frameworks: ["React", "Next.js", "TanStack", "Vite", "Express"],
        ai_ml: ["LLMs", "Vector databases", "Prompt engineering", "LangChain"],
        tools: ["Git", "Docker", "Vercel", "Supabase", "PostgreSQL"],
      },
      projects: [
        {
          name: "AI Chat Application",
          description: "Intelligent chat interface with generative UI",
          tags: ["AI", "Chat", "Generative UI"],
        },
        {
          name: "Developer Tools",
          description: "Productivity tools for developers",
          tags: ["Developer Tools", "Open Source"],
        },
        {
          name: "Personal Knowledge Base",
          description: "AI-powered knowledge management",
          tags: ["AI", "Knowledge", "Productivity"],
        },
      ],
      contact: {
        email: "hello@example.com",
        github: "github.com/username",
        linkedin: "linkedin.com/in/username",
        twitter: "@twitterhandle",
      },
    };

    if (section === "all") {
      return aboutData;
    }

    return aboutData[section as keyof typeof aboutData];
  },
});
