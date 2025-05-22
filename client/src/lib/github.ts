import { GithubRepoData } from "@shared/schema";

/**
 * Extracts owner and repository name from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
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

/**
 * Generates a badge URL for a repository
 */
export function generateBadgeUrl(type: string, value: string, color: string): string {
  return `https://img.shields.io/badge/${type}-${encodeURIComponent(value)}-${color}.svg`;
}

/**
 * Returns typical license badge based on license type with logo
 */
export function getLicenseBadge(license?: { name: string; spdx_id: string }): string {
  if (!license) {
    return `https://img.shields.io/badge/license-Not%20Specified-lightgrey?style=for-the-badge&logo=opensourceinitiative&logoColor=white`;
  }
  
  const licenseId = license.spdx_id || license.name;
  const color = getLicenseColor(licenseId);
  
  // Using shields.io badge with logo for more professional appearance
  return `https://img.shields.io/badge/license-${encodeURIComponent(licenseId)}-${color}?style=for-the-badge&logo=opensourceinitiative&logoColor=white`;
}

/**
 * Returns a color for a license type using hex colors for better aesthetics
 */
function getLicenseColor(licenseId: string): string {
  const licenseColors: Record<string, string> = {
    MIT: "44CC11",
    Apache: "D22128",
    GPL: "A42E2B",
    "BSD": "3C5280",
    ISC: "22BABB",
    Unlicense: "4CAF50",
    "LGPL": "007EC6",
    "MPL": "E05D44",
    "AGPL": "51BB7B"
  };
  
  // Check if license ID contains any of the keys
  for (const [key, color] of Object.entries(licenseColors)) {
    if (licenseId.includes(key)) {
      return color;
    }
  }
  
  return "7B7B7B"; // Better gray color
}

/**
 * Creates a language badge for the repository with logo
 */
export function getLanguageBadge(language: string): string {
  if (!language) {
    return "";
  }

  // Define language-specific colors that match their official branding
  const languageColors: Record<string, string> = {
    JavaScript: "F7DF1E",
    TypeScript: "3178C6",
    Python: "3776AB",
    Java: "007396",
    "C++": "00599C",
    "C#": "239120",
    PHP: "777BB4",
    Ruby: "CC342D",
    Swift: "FA7343",
    Go: "00ADD8",
    Rust: "000000",
    HTML: "E34F26",
    CSS: "1572B6",
    Shell: "4EAA25",
    Dart: "0175C2",
    Kotlin: "7F52FF",
    R: "276DC3"
  };
  
  // Mapping language names to their corresponding shields.io logo names
  const logoNames: Record<string, string> = {
    JavaScript: "javascript",
    TypeScript: "typescript",
    Python: "python",
    Java: "java",
    "C++": "cplusplus",
    "C#": "csharp",
    PHP: "php",
    Ruby: "ruby",
    Swift: "swift",
    Go: "go",
    Rust: "rust",
    HTML: "html5",
    CSS: "css3",
    Shell: "gnubash",
    Dart: "dart",
    Kotlin: "kotlin",
    R: "r"
  };

  const color = languageColors[language] || "38B2AC";
  const logoName = logoNames[language] || "code";
  
  // Using shields.io badge with logo for more professional appearance
  return `https://img.shields.io/badge/${encodeURIComponent(language)}-${color}?style=for-the-badge&logo=${logoName}&logoColor=white`;
}
