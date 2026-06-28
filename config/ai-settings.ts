import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('.env.ai') });
dotenv.config();

export interface AiSettings {
  healingEnabled: boolean;
  provider: 'ollama' | 'groq' | 'openai' | 'anthropic';
  maxHealsPerRun: number;
  cacheDir: string;
  triageEnabled: boolean;
  ollamaBaseUrl: string;
  ollamaModel: string;
}

let aiSettingsInstance: AiSettings | null = null;

export function aiSettings(): AiSettings {
  if (!aiSettingsInstance) {
    aiSettingsInstance = {
      healingEnabled: process.env.AI_HEALING_ENABLED === 'true',
      provider: (process.env.AI_PROVIDER as AiSettings['provider']) || 'ollama',
      maxHealsPerRun: Number(process.env.AI_MAX_HEALS_PER_RUN || '10'),
      cacheDir: process.env.AI_HEAL_CACHE_DIR || '.ai-heal-cache',
      triageEnabled: process.env.AI_TRIAGE_ENABLED === 'true',
      ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
      ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
    };
  }
  return aiSettingsInstance;
}

export function resetAiSettingsForTests(): void {
  aiSettingsInstance = null;
}
