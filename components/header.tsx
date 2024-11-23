"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/settings-modal";
import { useState } from "react";
import { useAIProvider } from "@/contexts/ai-provider-context";
import { ThemeToggle } from "./theme-toggle";
import { ScanSearch } from "lucide-react";

export function Header() {

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { provider, setProvider, analysisType, setAnalysisType, storageProvider, setStorageProvider } = useAIProvider();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ScanSearch className="h-8 w-8" />
            <span className="text-2xl font-bold">InfoExtract.AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <a
              className="flex max-w-fit items-center justify-center space-x-2 rounded-full border bg-background px-4 py-2 text-sm shadow-md transition-colors hover:bg-accent"
              href="https://github.com/antonio-abrantes/infoextract.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-5 w-5" />
              <p>Star on GitHub</p>
            </a>
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProvider={provider}
        onProviderChange={setProvider}
        currentAnalysisType={analysisType}
        onAnalysisTypeChange={setAnalysisType}
        currentStorageProvider={storageProvider}
        onStorageProviderChange={setStorageProvider}
      />
    </header>
  );
}
