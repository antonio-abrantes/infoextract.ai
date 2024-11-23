import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROMPTS, PromptType } from "@/lib/prompts";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAIProvider } from "@/contexts/ai-provider-context";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: 'groq' | 'openai';
  onProviderChange: (provider: 'groq' | 'openai') => void;
  currentAnalysisType: PromptType;
  onAnalysisTypeChange: (type: PromptType) => void;
  currentStorageProvider: 'minio' | 'aws';
  onStorageProviderChange: (provider: 'minio' | 'aws') => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentProvider,
  onProviderChange,
  currentAnalysisType,
  onAnalysisTypeChange,
  currentStorageProvider,
  onStorageProviderChange,
}: SettingsModalProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const { globalApiKey, setGlobalApiKey } = useAIProvider();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      description="Configure the analysis options"
    >
      <div className="py-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Global API Key</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? "text" : "password"}
                value={globalApiKey}
                onChange={(e) => setGlobalApiKey(e.target.value)}
                placeholder="Enter your global API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">AI Provider</h3>
          <RadioGroup
            value={currentProvider}
            onValueChange={(value: 'groq' | 'openai') => onProviderChange(value)}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="groq" id="groq" />
              <Label htmlFor="groq">Groq AI (Default)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="openai" id="openai" />
              <Label htmlFor="openai">OpenAI</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Type of Analysis</h3>
          <Select value={currentAnalysisType} onValueChange={onAnalysisTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select the type of analysis" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROMPTS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Storage Provider</h3>
          <Select value={currentStorageProvider} onValueChange={onStorageProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select the storage provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minio">MinIO S3 (Default)</SelectItem>
              <SelectItem value="aws">AWS S3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
} 