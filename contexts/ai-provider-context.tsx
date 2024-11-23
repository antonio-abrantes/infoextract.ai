"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { PromptType } from "@/lib/prompts";

type AIProvider = 'groq' | 'openai';
type StorageProvider = 'minio' | 'aws';

interface AIProviderContextType {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  analysisType: PromptType;
  setAnalysisType: (type: PromptType) => void;
  storageProvider: StorageProvider;
  setStorageProvider: (provider: StorageProvider) => void;
  globalApiKey: string;
  setGlobalApiKey: (key: string) => void;
}

const AIProviderContext = createContext<AIProviderContextType | undefined>(undefined);

const STORAGE_KEY = 'infoextract-global-api-key';

export function AIProviderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<AIProvider>('groq');
  const [analysisType, setAnalysisType] = useState<PromptType>('menu');
  const [storageProvider, setStorageProvider] = useState<StorageProvider>('minio');
  const [globalApiKey, setGlobalApiKeyState] = useState<string>('');

  // Carrega a API key do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem(STORAGE_KEY);
      if (savedApiKey) {
        setGlobalApiKeyState(savedApiKey);
      }
    }
  }, []);

  // Função wrapper para atualizar o estado e o localStorage
  const setGlobalApiKey = (key: string) => {
    setGlobalApiKeyState(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem(STORAGE_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  return (
    <AIProviderContext.Provider value={{ 
      provider, 
      setProvider, 
      analysisType, 
      setAnalysisType,
      storageProvider,
      setStorageProvider,
      globalApiKey,
      setGlobalApiKey
    }}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAIProvider() {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAIProvider must be used within a AIProviderProvider');
  }
  return context;
} 