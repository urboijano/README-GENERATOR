import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema for repository information
export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  description: text("description"),
  language: text("language"),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  hasIssues: boolean("has_issues").default(true),
  hasWiki: boolean("has_wiki").default(true),
  createdAt: text("created_at").notNull(),
});

// Schema for README templates
export const readmeTemplates = pgTable("readme_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isDefault: boolean("is_default").default(false),
});

// Create insert schemas
export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
});

export const insertReadmeTemplateSchema = createInsertSchema(readmeTemplates).omit({
  id: true,
});

// Define validation schema for repository URL input
export const repoUrlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (val) => val.startsWith("https://github.com/") || val.startsWith("http://github.com/"),
      {
        message: "URL must be a valid GitHub repository URL",
      }
    ),
});

// Define types
export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type ReadmeTemplate = typeof readmeTemplates.$inferSelect;
export type InsertReadmeTemplate = z.infer<typeof insertReadmeTemplateSchema>;
export type RepoUrlInput = z.infer<typeof repoUrlSchema>;

// Repository data type received from the GitHub API
export interface GithubRepoData {
  name: string;
  owner: {
    login: string;
  };
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  has_issues: boolean;
  has_wiki: boolean;
  created_at: string;
  default_branch: string;
  license?: {
    name: string;
    spdx_id: string;
    url: string;
  };
  topics?: string[];
  // Additional properties for automatic analysis
  projectType?: string;
  frameworks?: string[];
  detectedFeatures?: string[];
  projectPurpose?: string;
  mainComponents?: string[];
}
