import { useState } from "react";
import { GithubRepoData } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { generateReadme, getReadmeSections } from "@/lib/readme-templates";

interface SettingsPanelProps {
  repoData: GithubRepoData;
  readmeContent: string;
  onReadmeChange: (content: string) => void;
}

export function SettingsPanel({ repoData, readmeContent, onReadmeChange }: SettingsPanelProps) {
  const { toast } = useToast();
  const [sections, setSections] = useState<Record<string, boolean>>({
    title: true,
    badges: true,
    description: true,
    installation: true,
    usage: true,
    features: true,
    contributing: true,
    license: true,
  });

  const handleSectionToggle = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const regenerateReadme = () => {
    // Filter sections based on checkboxes
    const enabledSections = Object.entries(sections)
      .filter(([_, enabled]) => enabled)
      .map(([section]) => section);

    // Generate new README with selected sections
    const newReadme = generateReadme(repoData, enabledSections);
    onReadmeChange(newReadme);

    toast({
      title: "README Regenerated",
      description: "README has been regenerated with your selected sections",
    });
  };

  return (
    <Card className="bg-white border border-[#D0D7DE] rounded-md shadow-md">
      <CardHeader className="border-b border-[#D0D7DE] p-4 bg-[#F6F8FA]">
        <h3 className="font-medium">README Settings</h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-4">Sections to Include</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sections).map(([section, enabled]) => (
                <div key={section} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`section-${section}`} 
                    checked={enabled}
                    onCheckedChange={() => handleSectionToggle(section)}
                  />
                  <Label htmlFor={`section-${section}`} className="capitalize">
                    {section}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button 
              onClick={regenerateReadme}
              className="px-4 py-2 bg-[#0969DA] text-white hover:bg-blue-700 transition"
            >
              Regenerate README
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
