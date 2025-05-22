import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { repoUrlSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Function to extract owner and repo name from GitHub URL
function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") {
      return null;
    }

    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return null;
    }

    return {
      owner: pathParts[0],
      repo: pathParts[1],
    };
  } catch (error) {
    return null;
  }
}

async function fetchRepositoryData(owner: string, repo: string) {
  try {
    // Add User-Agent header as GitHub API requires it
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-README-Generator",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository not found: ${owner}/${repo}. Please check if the repository exists and is public.`);
      } else if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error(`GitHub API rate limit exceeded. Please try again later.`);
      } else {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repository data:", error);
    throw error;
  }
}

async function fetchRepositoryContent(owner: string, repo: string, path: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-README-Generator",
      },
    });

    if (!response.ok) {
      // Don't throw error for missing README - we'll generate one
      if (response.status === 404) {
        console.log(`No ${path} found in repository ${owner}/${repo}`);
        return null;
      }
      
      // Log rate limit information if available
      if (response.status === 403) {
        console.log(`Rate limit info: ${response.headers.get('x-ratelimit-remaining')} / ${response.headers.get('x-ratelimit-limit')}`);
      }
      
      return null;
    }

    const data = await response.json();
    if (data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch (error) {
    console.error("Error fetching repository content:", error);
    return null;
  }
}

// Function to fetch repository directory structure for analysis
async function fetchRepositoryStructure(owner: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-README-Generator",
      },
    });

    if (response.status === 404) {
      // Try master branch if main doesn't exist
      const masterResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-README-Generator",
        },
      });
      
      if (!masterResponse.ok) {
        return null;
      }
      
      return await masterResponse.json();
    }

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repository structure:", error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch repository data
  app.post("/api/repo-data", async (req, res) => {
    try {
      const validatedData = repoUrlSchema.parse(req.body);
      const repoInfo = extractRepoInfo(validatedData.url);
      
      if (!repoInfo) {
        return res.status(400).json({ 
          message: "Invalid GitHub repository URL. Please provide a URL in the format: https://github.com/{owner}/{repo}" 
        });
      }

      const { owner, repo } = repoInfo;
      
      // Fetch repository data from GitHub API
      const repoData = await fetchRepositoryData(owner, repo);
      
      // Ensure owner information is properly set - this fixes the undefined owner issue
      if (!repoData.owner || !repoData.owner.login) {
        repoData.owner = { login: owner };
      }
      
      // Check if a README already exists
      const existingReadme = await fetchRepositoryContent(owner, repo, 'README.md');
      
      // Fetch repository structure for analysis
      const repoStructure = await fetchRepositoryStructure(owner, repo);
      
      // Extract key files and folders for analysis
      let projectType = '';
      let frameworks = [];
      let features = [];
      let projectPurpose = '';
      let mainComponents = [];
      
      if (repoStructure && repoStructure.tree) {
        const files = repoStructure.tree.map(item => item.path);
        
        // Detect project type and frameworks
        if (files.includes('package.json')) {
          projectType = 'Node.js';
          
          // Analyze frontend frameworks
          if (files.some(f => f.includes('react'))) frameworks.push('React');
          if (files.some(f => f.includes('vue'))) frameworks.push('Vue.js');
          if (files.some(f => f.includes('angular'))) frameworks.push('Angular');
          if (files.some(f => f.includes('next'))) frameworks.push('Next.js');
          
          // Detect database usage
          if (files.some(f => f.includes('mongoose') || f.includes('mongodb'))) frameworks.push('MongoDB');
          if (files.some(f => f.includes('sequelize') || f.includes('mysql'))) frameworks.push('SQL Database');
          if (files.some(f => f.includes('postgres') || f.includes('pg'))) frameworks.push('PostgreSQL');
        }
        
        if (files.includes('requirements.txt') || files.some(f => f.endsWith('.py'))) {
          projectType = 'Python';
          
          // Analyze Python frameworks
          if (files.some(f => f.includes('django'))) frameworks.push('Django');
          if (files.some(f => f.includes('flask'))) frameworks.push('Flask');
          if (files.some(f => f.includes('fastapi'))) frameworks.push('FastAPI');
        }
        
        // Analyze project purpose by looking at key directories and files
        if (files.some(f => f.includes('ecommerce') || f.includes('shop') || f.includes('store') || f.includes('product'))) {
          projectPurpose = 'E-commerce platform';
          mainComponents.push('product management');
          mainComponents.push('shopping cart');
          mainComponents.push('checkout system');
        } 
        else if (files.some(f => f.includes('blog') || f.includes('post') || f.includes('article'))) {
          projectPurpose = 'Content management system';
          mainComponents.push('article publishing');
          mainComponents.push('content organization');
        }
        else if (files.some(f => f.includes('dashboard') || f.includes('admin') || f.includes('analytics'))) {
          projectPurpose = 'Administration dashboard';
          mainComponents.push('data visualization');
          mainComponents.push('user management');
        }
        else if (files.some(f => f.includes('chat') || f.includes('message') || f.includes('socket'))) {
          projectPurpose = 'Real-time communication platform';
          mainComponents.push('message exchange');
          mainComponents.push('real-time updates');
        }
        else if (files.some(f => f.includes('game') || f.includes('player'))) {
          projectPurpose = 'Interactive game application';
          mainComponents.push('game mechanics');
          mainComponents.push('user interaction');
        }
        else if (files.some(f => f.includes('booking') || f.includes('reservation') || f.includes('appointment'))) {
          projectPurpose = 'Booking and reservation system';
          mainComponents.push('scheduling functionality');
          mainComponents.push('reservation management');
        }
        else if (files.some(f => f.includes('weather') || f.includes('forecast'))) {
          projectPurpose = 'Weather information application';
          mainComponents.push('weather data display');
          mainComponents.push('location-based services');
        }
        else if (files.some(f => f.includes('task') || f.includes('todo'))) {
          projectPurpose = 'Task management application';
          mainComponents.push('task tracking');
          mainComponents.push('productivity tools');
        }
        else if (repoData.name.toLowerCase().includes('portfolio')) {
          projectPurpose = 'Personal portfolio website';
          mainComponents.push('project showcase');
          mainComponents.push('skills presentation');
        }
        
        // Check for special purposes from repo name
        if (repoData.name.toLowerCase().includes('massage') || 
            repoData.name.toLowerCase().includes('spa') || 
            repoData.name.toLowerCase().includes('salon')) {
          projectPurpose = 'Massage service/spa booking platform';
          mainComponents.push('appointment scheduling');
          mainComponents.push('service selection');
          mainComponents.push('customer management');
        }
        
        // Extract potential features from file structure
        if (files.some(f => f.includes('auth') || f.includes('login'))) 
          features.push('User authentication system');
        
        if (files.some(f => f.includes('api') || f.includes('endpoints'))) 
          features.push('RESTful API implementation');
          
        if (files.some(f => f.includes('test'))) 
          features.push('Comprehensive test suite');
          
        if (files.some(f => f.includes('docker') || f.includes('Dockerfile'))) 
          features.push('Docker containerization');
          
        if (files.some(f => f.includes('ci') || f.includes('.github/workflows'))) 
          features.push('CI/CD pipeline integration');
          
        if (files.some(f => f.includes('payment') || f.includes('stripe') || f.includes('paypal')))
          features.push('Secure payment processing');
          
        if (files.some(f => f.includes('notification') || f.includes('email')))
          features.push('Notification system');
          
        if (files.some(f => f.includes('responsive') || f.includes('mobile')))
          features.push('Responsive design for all devices');
      }
      
      // Safely extract data with fallbacks for missing properties
      return res.json({
        repository: {
          name: repoData.name || 'Repository',
          owner: repoData.owner?.login || owner,
          description: repoData.description || '',
          language: repoData.language || '',
          stars: repoData.stargazers_count || 0,
          forks: repoData.forks_count || 0,
          hasIssues: repoData.has_issues || false,
          hasWiki: repoData.has_wiki || false,
          license: repoData.license || null,
          topics: repoData.topics || [],
          defaultBranch: repoData.default_branch || 'main',
          // Add analyzed data
          projectType: projectType || '',
          frameworks: frameworks,
          detectedFeatures: features,
          projectPurpose: projectPurpose || '',
          mainComponents: mainComponents
        },
        existingReadme
      });
    } catch (error) {
      console.error("Error processing repository URL:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  });

  // API endpoint to generate README content
  app.post("/api/generate-readme", async (req, res) => {
    try {
      const { repository, template, sections } = req.body;
      
      if (!repository || !template) {
        return res.status(400).json({ message: "Repository data and template are required" });
      }

      // Here you would normally use the template and repo data to generate README content
      // For now, we're just returning the template as-is
      return res.json({ content: template });
    } catch (error) {
      console.error("Error generating README:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
