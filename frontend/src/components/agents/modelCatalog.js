// Static catalog of selectable LLM models per provider.
//
// The AI Models registry (Admin Settings → Integrations → AI Models) stores the
// provider + API key; the exact model is chosen per-agent from this list. v1
// supports Anthropic + OpenAI + OpenRouter — the providers the engine has tool-use
// adapters for — plus a free-text "custom slug" entry in the agent editor so any
// OpenRouter model (or private/aliased slug) can be used even when it isn't
// listed here. Keep these model ids in sync with backend/src/llm/* and
// backend/src/services/mcpService.js.

export const PROVIDER_LABELS = { anthropic: 'Anthropic Claude', openai: 'OpenAI', openrouter: 'OpenRouter' };

export const MODEL_CATALOG = {
  anthropic: [
    { value: 'claude-opus-4-7', label: 'Claude Opus 4.7 (most capable)' },
    { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (balanced)' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest)' },
  ],
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  // Curated OpenRouter model slugs (verified against the live catalog at
  // https://openrouter.ai/api/v1/models). OpenRouter accepts any `provider/model`
  // slug — the agent editor also offers a "custom slug" entry for everything else.
  openrouter: [
    { value: 'openrouter/free', label: 'Free Models Router (OpenRouter)' },
    { value: 'openai/gpt-4.1-mini', label: 'GPT-4.1 mini (OpenAI)' },
    { value: 'openai/gpt-4.1', label: 'GPT-4.1 (OpenAI)' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o mini (OpenAI)' },
    { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo (OpenAI)' },
    { value: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6 (Anthropic)' },
    { value: 'anthropic/claude-haiku-4.5', label: 'Claude Haiku 4.5 (Anthropic)' },
    { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct (Meta)' },
    { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3 (DeepSeek)' },
    { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Google)' },
    { value: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (Google)' },
    { value: 'mistralai/mistral-small-3.2-24b-instruct', label: 'Mistral Small 3.2 24B (Mistral)' },
    { value: 'qwen/qwen-plus', label: 'Qwen Plus (Alibaba)' },
  ],
};

export function modelsForProvider(provider) {
  return MODEL_CATALOG[provider] || [];
}

export function providerDisplay(provider, label) {
  const base = PROVIDER_LABELS[provider] || provider || 'Unknown';
  return label ? `${base} — ${label}` : base;
}
