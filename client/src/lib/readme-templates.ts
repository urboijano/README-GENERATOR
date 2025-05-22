import { GithubRepoData } from "@shared/schema";
import { getLicenseBadge, getLanguageBadge, generateBadgeUrl } from "./github";

/**
 * Generates a complete README based on repository data
 */
export function generateReadme(repoData: GithubRepoData, sections?: string[]): string {
  const availableSections = {
    title: generateTitle(repoData),
    badges: generateBadges(repoData),
    description: generateDescription(repoData),
    tableOfContents: generateTableOfContents(sections),
    demo: generateDemoSection(),
    techStack: generateTechStack(repoData),
    installation: generateInstallation(repoData),
    usage: generateUsage(repoData),
    features: generateFeatures(repoData),
    api: generateApi(),
    configuration: generateConfiguration(),
    contributing: generateContributing(),
    testing: generateTesting(),
    acknowledgements: generateAcknowledgements(),
    license: generateLicense(repoData),
  };

  // If no sections specified, include all
  const sectionsToInclude = sections || [
    "title", 
    "badges", 
    "description", 
    "tableOfContents",
    "techStack",
    "installation",
    "usage",
    "features",
    "contributing",
    "license"
  ];
  
  // Build README content from selected sections
  let content = "";
  for (const section of sectionsToInclude) {
    if (section in availableSections) {
      content += availableSections[section as keyof typeof availableSections];
      content += "\n\n";
    }
  }
  
  return content.trim();
}

/**
 * Returns all available README section names
 */
export function getReadmeSections(): string[] {
  return [
    "title",
    "badges",
    "description",
    "tableOfContents",
    "demo",
    "techStack",
    "installation",
    "usage",
    "features",
    "api",
    "configuration",
    "contributing",
    "testing",
    "acknowledgements",
    "license"
  ];
}

// Individual section generators

function generateTitle(repoData: GithubRepoData): string {
  return `<div align="center">

# ${repoData.name}

</div>`;
}

function generateTableOfContents(sections?: string[]): string {
  if (!sections) {
    sections = [
      "description", 
      "techStack",
      "installation",
      "usage",
      "features",
      "contributing",
      "license"
    ];
  }
  
  let content = "## Table of Contents\n\n";
  
  const sectionTitles: Record<string, string> = {
    description: "Description",
    tableOfContents: "Table of Contents",
    demo: "Demo",
    techStack: "Tech Stack",
    installation: "Installation",
    usage: "Usage",
    features: "Features",
    api: "API Reference",
    configuration: "Configuration",
    contributing: "Contributing",
    testing: "Testing",
    acknowledgements: "Acknowledgements",
    license: "License"
  };
  
  sections.forEach((section, index) => {
    if (section !== "title" && section !== "badges" && section !== "tableOfContents" && sectionTitles[section]) {
      content += `${index+1}. [${sectionTitles[section]}](#${sectionTitles[section].toLowerCase().replace(/\s+/g, '-')})\n`;
    }
  });
  
  return content;
}

function generateDemoSection(): string {
  return `## Demo

![Demo](https://via.placeholder.com/640x360.png?text=App+Demo)

[Live Demo](https://example.com) • [Video Walkthrough](https://example.com)`;
}

function generateTechStack(repoData: GithubRepoData): string {
  let content = `## Tech Stack\n\n`;
  
  // Primary language
  if (repoData.language) {
    content += `### Built With\n\n`;
    
    const languageIcons: Record<string, string> = {
      JavaScript: "https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black",
      TypeScript: "https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white",
      Python: "https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white",
      Java: "https://img.shields.io/badge/Java-ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white",
      Go: "https://img.shields.io/badge/Go-00ADD8.svg?style=for-the-badge&logo=Go&logoColor=white",
      Ruby: "https://img.shields.io/badge/Ruby-CC342D.svg?style=for-the-badge&logo=Ruby&logoColor=white",
      PHP: "https://img.shields.io/badge/PHP-777BB4.svg?style=for-the-badge&logo=PHP&logoColor=white",
      "C#": "https://img.shields.io/badge/C%23-239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white",
      "C++": "https://img.shields.io/badge/C++-00599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white",
      HTML: "https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white",
      CSS: "https://img.shields.io/badge/CSS3-1572B6.svg?style=for-the-badge&logo=CSS3&logoColor=white"
    };
    
    if (languageIcons[repoData.language]) {
      content += `![${repoData.language}](${languageIcons[repoData.language]})\n\n`;
    } else {
      content += `- **${repoData.language}** - Primary language\n`;
    }
    
    // Add common frameworks based on language
    if (repoData.language === "JavaScript" || repoData.language === "TypeScript") {
      content += `
- Frontend frameworks/libraries
  - ![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)
  - ![Next.js](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)

- Backend & Database
  - ![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
  - ![Express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
  - ![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
`;
    } else if (repoData.language === "Python") {
      content += `
- Web Frameworks
  - ![Django](https://img.shields.io/badge/Django-092E20.svg?style=for-the-badge&logo=Django&logoColor=white)
  - ![Flask](https://img.shields.io/badge/Flask-000000.svg?style=for-the-badge&logo=Flask&logoColor=white)

- Data & ML
  - ![NumPy](https://img.shields.io/badge/NumPy-013243.svg?style=for-the-badge&logo=NumPy&logoColor=white)
  - ![Pandas](https://img.shields.io/badge/pandas-150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
`;
    }
  } else {
    content += "- This repository's tech stack details weren't detected automatically.\n";
  }
  
  return content;
}

function generateBadges(repoData: GithubRepoData): string {
  let content = `<div align="center">\n\n`;
  
  // License badge with modern styling and logo
  if (repoData.license) {
    content += `[![License](${getLicenseBadge(repoData.license)})](LICENSE)\n\n`;
  } else {
    content += `[![License](${getLicenseBadge()})](LICENSE)\n\n`;
  }
  
  // Modern language badge using our enhanced function with logo
  if (repoData.language) {
    content += `[![${repoData.language}](${getLanguageBadge(repoData.language)})]()\n\n`;
  }
  
  // Make sure owner information exists before trying to use it
  if (repoData.owner && repoData.owner.login) {
    const owner = repoData.owner.login;
    const repo = repoData.name;
    
    // Add repository stats badges with logos
    const badges = [];
    
    // Stars badge with GitHub logo
    badges.push(`[![Stars](https://img.shields.io/github/stars/${owner}/${repo}?style=for-the-badge&logo=github)](https://github.com/${owner}/${repo}/stargazers)`);
    
    // Forks badge with GitHub logo
    badges.push(`[![Forks](https://img.shields.io/github/forks/${owner}/${repo}?style=for-the-badge&logo=github)](https://github.com/${owner}/${repo}/network/members)`);
    
    // Issues badge with GitHub logo (if issues are enabled)
    if (repoData.has_issues) {
      badges.push(`[![Issues](https://img.shields.io/github/issues/${owner}/${repo}?style=for-the-badge&logo=github)](https://github.com/${owner}/${repo}/issues)`);
    }
    
    // Last commit badge with Git logo
    badges.push(`[![Last Commit](https://img.shields.io/github/last-commit/${owner}/${repo}?style=for-the-badge&logo=git)](https://github.com/${owner}/${repo}/commits)`);
    
    content += badges.join('\n');
  } else {
    // Fallback for when owner information is missing - prevents "repo not found" errors
    content += `*Repository statistics will be available once the project is published to GitHub*`;
  }
  
  content += `\n\n</div>`;
  
  return content;
}

function generateDescription(repoData: GithubRepoData): string {
  let content = "## Description\n\n";
  
  // Use repository description or create a fallback
  if (repoData.description) {
    content += repoData.description;
  } else {
    content += `This is a ${repoData.language || ""} project with modern architecture and best practices.`;
  }
  
  content += `\n\n### About This Project\n\n`;
  
  // Use automatically detected project purpose if available
  if (repoData.projectPurpose) {
    content += `${repoData.name} is a ${repoData.projectPurpose} `;
    
    if (repoData.projectType) {
      content += `developed with ${repoData.projectType}`;
      
      if (repoData.frameworks && repoData.frameworks.length > 0) {
        content += ` and powered by ${repoData.frameworks.join(', ')}`;
      }
      
      content += `. `;
    } else if (repoData.language) {
      content += `built using ${repoData.language}. `;
    } else {
      content += `. `;
    }
    
    // Add information about main components
    if (repoData.mainComponents && repoData.mainComponents.length > 0) {
      content += `The system provides ${repoData.mainComponents.join(', ')}, `;
      content += `delivering a comprehensive solution for users.`;
    }
  } else if (repoData.projectType) {
    // Fallback to project type if purpose not detected
    content += `${repoData.name} is a ${repoData.projectType} application`;
    
    if (repoData.frameworks && repoData.frameworks.length > 0) {
      content += ` built with ${repoData.frameworks.join(', ')}.`;
    } else {
      content += `.`;
    }
  } else if (repoData.language) {
    // Fallback to language-based description
    switch(repoData.language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        content += `${repoData.name} is a web application built with ${repoData.language}, designed to provide a smooth and responsive user experience.`;
        break;
      case 'python':
        content += `${repoData.name} is a Python-based application that leverages the language's flexibility and extensive libraries for efficient data processing and user interaction.`;
        break;
      case 'java':
        content += `${repoData.name} is a robust Java application that emphasizes reliability, performance, and cross-platform compatibility.`;
        break;
      default:
        content += `${repoData.name} is an application developed using ${repoData.language}, focusing on delivering a streamlined user experience.`;
    }
  } else {
    content += `${repoData.name} is a software project designed to deliver efficient and user-friendly functionality.`;
  }
  
  // Add topics if available for enhanced SEO and categorization
  if (repoData.topics && repoData.topics.length > 0) {
    content += `\n\n### Keywords\n\n`;
    content += repoData.topics.map(t => `\`${t}\``).join(' · ');
  }
  
  return content;
}

function generateInstallation(repoData: GithubRepoData): string {
  let content = "## Installation\n\n";
  content += "```bash\n";
  content += `git clone https://github.com/${repoData.owner.login}/${repoData.name}.git\n`;
  content += `cd ${repoData.name}\n`;
  
  // Add language-specific installation instructions
  if (repoData.language) {
    const language = repoData.language.toLowerCase();
    
    if (language === "javascript" || language === "typescript") {
      content += "npm install\n";
    } else if (language === "python") {
      content += "pip install -r requirements.txt\n";
    } else if (language === "ruby") {
      content += "bundle install\n";
    } else if (language === "go") {
      content += "go mod download\n";
    }
  }
  
  content += "```";
  return content;
}

function generateUsage(repoData: GithubRepoData): string {
  let content = "## Usage\n\n";
  
  // Language-specific usage examples
  if (repoData.language) {
    const language = repoData.language.toLowerCase();
    
    if (language === "javascript" || language === "typescript") {
      content += "```javascript\n";
      content += `// Import the ${repoData.name} package\n`;
      content += `import { ${capitalizeFirstLetter(repoData.name)} } from './${repoData.name}';\n\n`;
      content += `// Initialize\n`;
      content += `const myInstance = new ${capitalizeFirstLetter(repoData.name)}();\n\n`;
      content += `// Example usage\n`;
      content += `myInstance.start();\n`;
      content += "```\n";
    } else if (language === "python") {
      content += "```python\n";
      content += `# Import the module\n`;
      content += `from ${repoData.name.replace(/-/g, '_')} import main\n\n`;
      content += `# Example usage\n`;
      content += `main.start()\n`;
      content += "```\n";
    } else {
      content += "Refer to the documentation for usage examples.";
    }
  } else {
    content += "Refer to the documentation for usage examples.";
  }
  
  return content;
}

function generateFeatures(repoData: GithubRepoData): string {
  let content = `## Features\n\n`;
  
  // Use automatically detected features if available
  if (repoData.detectedFeatures && repoData.detectedFeatures.length > 0) {
    repoData.detectedFeatures.forEach(feature => {
      content += `- ${feature}\n`;
    });
    
    // Add some additional relevant features based on the project type
    if (repoData.projectType === 'Node.js') {
      content += `- Fast and efficient server-side rendering\n`;
      content += `- Modular architecture for easy maintenance\n`;
    } else if (repoData.projectType === 'Python') {
      content += `- Extensive data processing capabilities\n`;
      content += `- Clean, readable code following PEP standards\n`;
    }
  } else {
    // Fallback to generic features based on language
    if (repoData.language) {
      switch (repoData.language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
          content += `- Modern and responsive user interface\n`;
          content += `- Fast and efficient client-side rendering\n`;
          content += `- State management for consistent user experience\n`;
          content += `- API integration for dynamic data loading\n`;
          break;
        case 'python':
          content += `- Data processing and analysis capabilities\n`;
          content += `- Clean and maintainable codebase\n`;
          content += `- Efficient algorithms for performance\n`;
          content += `- Comprehensive error handling\n`;
          break;
        default:
          content += `- Intuitive user interface\n`;
          content += `- Efficient performance optimization\n`;
          content += `- Comprehensive documentation\n`;
          content += `- Modular and maintainable codebase\n`;
      }
    } else {
      // Generic features for any project
      content += `- Intuitive user interface\n`;
      content += `- Efficient performance optimization\n`;
      content += `- Comprehensive documentation\n`;
      content += `- Modular and maintainable codebase\n`;
    }
  }
  
  return content;
}

function generateApi(): string {
  return `## API Reference

### GET /api/items

\`\`\`
  GET /api/items
\`\`\`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`api_key\` | \`string\` | **Required**. Your API key |

### GET /api/items/${'{id}'}

\`\`\`
  GET /api/items/${'{id}'}
\`\`\`

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| \`id\`      | \`string\` | **Required**. Id of item to fetch |
`;
}

function generateConfiguration(): string {
  return `## Configuration

To configure the application, create a \`.env\` file in the root directory with the following variables:

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase

# API Keys
API_KEY=your_api_key
\`\`\`
`;
}

function generateTesting(): string {
  return `## Testing

Run the test suite with the following command:

\`\`\`bash
npm run test
\`\`\`

For coverage report:

\`\`\`bash
npm run test:coverage
\`\`\`
`;
}

function generateAcknowledgements(): string {
  return `## Acknowledgements

 - [Awesome README Templates](https://github.com/matiassingers/awesome-readme)
 - [Shields.io](https://shields.io)
 - [GitHub Pages](https://pages.github.com)
`;
}

function generateContributing(): string {
  return `## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

Don't forget to give the project a star! Thanks for your support!`;
}

function generateLicense(repoData: GithubRepoData): string {
  let content = "## License\n\n";
  
  if (repoData.license) {
    content += `This project is licensed under the ${repoData.license.name} - see the [\`LICENSE\`](LICENSE) file for details.`;
  } else {
    content += "This project is licensed under the terms of the license included in the repository. See the [\`LICENSE\`](LICENSE) file for more information.";
  }
  
  return content;
}

// Helper functions
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
