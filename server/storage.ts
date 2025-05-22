import { type Repository, type InsertRepository } from "@shared/schema";

// Storage interface for repository operations

export interface IStorage {
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByUrl(url: string): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  listRepositories(): Promise<Repository[]>;
}

export class MemStorage implements IStorage {
  private repositories: Map<number, Repository>;
  currentId: number;

  constructor() {
    this.repositories = new Map();
    this.currentId = 1;
  }

  async getRepository(id: number): Promise<Repository | undefined> {
    return this.repositories.get(id);
  }

  async getRepositoryByUrl(url: string): Promise<Repository | undefined> {
    return Array.from(this.repositories.values()).find(
      (repo) => repo.url === url,
    );
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const id = this.currentId++;
    
    // Ensure all fields have at least null values for undefined properties
    const repo: Repository = { 
      ...insertRepo, 
      id,
      description: insertRepo.description ?? null,
      language: insertRepo.language ?? null,
      stars: insertRepo.stars ?? null,
      forks: insertRepo.forks ?? null,
      hasIssues: insertRepo.hasIssues ?? null,
      hasWiki: insertRepo.hasWiki ?? null
    };
    
    this.repositories.set(id, repo);
    return repo;
  }
  
  async listRepositories(): Promise<Repository[]> {
    return Array.from(this.repositories.values());
  }
}

export const storage = new MemStorage();
