import { useState } from "react";
import { GithubRepoData } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { renderMarkdown } from "@/lib/markdown";

interface ReadmePreviewProps {
  repoData: GithubRepoData;
  readmeContent: string;
}

export function ReadmePreview({ repoData, readmeContent }: ReadmePreviewProps) {
  const { toast } = useToast();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      toast({
        title: "Copied to clipboard",
        description: "README content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadReadme = () => {
    const element = document.createElement("a");
    const file = new Blob([readmeContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded README.md",
      description: "Your README file has been downloaded",
    });
  };

  return (
    <Card className="bg-white border border-[#D0D7DE] rounded-md overflow-hidden shadow-md">
      {/* Repository Info Bar */}
      <CardHeader className="bg-[#F6F8FA] border-b border-[#D0D7DE] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="text-[#24292F] h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-sm">{repoData.name}</span>
          <span className="mx-1 text-gray-500">/</span>
          <span className="text-[#0969DA] text-sm">README.md</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={copyToClipboard}
            variant="outline" 
            className="inline-flex items-center px-3 py-1 border border-[#D0D7DE] rounded-md bg-white text-sm font-medium text-[#1F2328] hover:bg-[#F6F8FA]"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </Button>
          <Button 
            onClick={downloadReadme}
            variant="outline" 
            className="inline-flex items-center px-3 py-1 border border-[#D0D7DE] rounded-md bg-white text-sm font-medium text-[#1F2328] hover:bg-[#F6F8FA]"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </Button>
        </div>
      </CardHeader>

      {/* README Content */}
      <CardContent className="p-6 github-markdown">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(readmeContent) }}
        />
      </CardContent>
    </Card>
  );
}
