import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RepoForm } from "@/components/repo-form";
import { ReadmePreview } from "@/components/readme-preview";
import { ReadmeEditor } from "@/components/readme-editor";
import { SettingsPanel } from "@/components/settings-panel";
import { GithubRepoData } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("preview");
  const [repoData, setRepoData] = useState<GithubRepoData | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRepoDataFetched = (data: GithubRepoData, readme: string) => {
    setRepoData(data);
    setReadmeContent(readme);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setRepoData(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#24292F] text-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <h1 className="text-xl font-bold">README Generator</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#F6F8FA] border-b border-[#D0D7DE] py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-4 text-[#1F2328]">Generate Professional README Files Instantly</h2>
              <p className="text-gray-600 mb-6">Create beautifully formatted README.md files for your GitHub repositories with just a URL. Save time and ensure your projects make a great first impression.</p>
              <a href="#generator" className="inline-block px-4 py-2 bg-[#0969DA] text-white rounded-md font-medium hover:bg-blue-700 transition">Start Generating</a>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb" 
                alt="GitHub interface with markdown editing" 
                className="rounded-lg shadow-md w-full h-[250px] object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#1F2328]">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F6F8FA] rounded-md p-6 border border-[#D0D7DE]">
              <div className="text-[#0969DA] mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#1F2328]">URL-Based Generation</h3>
              <p className="text-gray-600">Simply paste your repository URL and let our tool analyze and generate a comprehensive README.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F6F8FA] rounded-md p-6 border border-[#D0D7DE]">
              <div className="text-[#0969DA] mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#1F2328]">Live Preview</h3>
              <p className="text-gray-600">See your README with GitHub-style markdown rendering before downloading or copying.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F6F8FA] rounded-md p-6 border border-[#D0D7DE]">
              <div className="text-[#0969DA] mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#1F2328]">Export Options</h3>
              <p className="text-gray-600">Copy to clipboard or download as a .md file ready to use in your repository.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-12 bg-[#F6F8FA] border-t border-b border-[#D0D7DE]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-[#1F2328]">README Generator</h2>
          
          {/* URL Input Form */}
          <div className="bg-white rounded-md border border-[#D0D7DE] p-6 mb-8 shadow-md">
            <RepoForm 
              onRepoDataFetched={handleRepoDataFetched} 
              onError={handleError}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="border border-[#CF222E] bg-red-50 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0 text-[#CF222E]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#CF222E]">Error fetching repository</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0969DA]"></div>
              <p className="mt-4 text-gray-600">Fetching repository data...</p>
            </div>
          )}

          {/* Tabs Navigation */}
          {!isLoading && repoData && (
            <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="border-b border-[#D0D7DE] w-full justify-start rounded-none bg-transparent mb-6">
                <TabsTrigger 
                  value="preview"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#0969DA] data-[state=active]:text-[#0969DA] data-[state=active]:font-medium bg-transparent rounded-none"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger 
                  value="edit"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#0969DA] data-[state=active]:text-[#0969DA] data-[state=active]:font-medium bg-transparent rounded-none"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#0969DA] data-[state=active]:text-[#0969DA] data-[state=active]:font-medium bg-transparent rounded-none"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0">
                <ReadmePreview 
                  repoData={repoData} 
                  readmeContent={readmeContent} 
                />
              </TabsContent>

              <TabsContent value="edit" className="mt-0">
                <ReadmeEditor 
                  content={readmeContent} 
                  onChange={setReadmeContent} 
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsPanel 
                  repoData={repoData} 
                  readmeContent={readmeContent}
                  onReadmeChange={setReadmeContent}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>


    </div>
  );
}
