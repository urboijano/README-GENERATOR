import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { repoUrlSchema, type RepoUrlInput, type GithubRepoData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { generateReadme } from "@/lib/readme-templates";

interface RepoFormProps {
  onRepoDataFetched: (repoData: GithubRepoData, readme: string) => void;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function RepoForm({ onRepoDataFetched, onError, setIsLoading }: RepoFormProps) {
  const form = useForm<RepoUrlInput>({
    resolver: zodResolver(repoUrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: RepoUrlInput) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/repo-data", data);
      const result = await response.json();
      
      // Generate README content or use existing one
      const readmeContent = result.existingReadme || generateReadme(result.repository);
      
      onRepoDataFetched(result.repository, readmeContent);
    } catch (error) {
      console.error('Error fetching repository data:', error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("Failed to fetch repository data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-2">GitHub Repository URL</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input
                    {...field}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969DA] focus:border-transparent"
                  />
                </FormControl>
                <Button 
                  type="submit" 
                  className="px-4 py-2 bg-[#0969DA] text-white rounded-md hover:bg-blue-700 transition shrink-0"
                >
                  Generate
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Enter the full URL of your GitHub repository</p>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
