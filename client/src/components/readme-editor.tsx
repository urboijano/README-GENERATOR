import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ReadmeEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ReadmeEditor({ content, onChange }: ReadmeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <Card className="bg-white border border-[#D0D7DE] rounded-md shadow-md">
      <CardHeader className="border-b border-[#D0D7DE] p-4 bg-[#F6F8FA]">
        <h3 className="font-medium">Edit README Content</h3>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea 
          value={content}
          onChange={handleChange}
          className="w-full h-[600px] font-mono text-sm p-4 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969DA] focus:border-transparent"
        />
      </CardContent>
    </Card>
  );
}
