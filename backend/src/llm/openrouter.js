// OpenRouter adapter. OpenRouter exposes an OpenAI-compatible /chat/completions
// endpoint, so we reuse the OpenAI adapter's tool-call loop and only override
// the base URL plus the recommended attribution headers (see
// https://openrouter.ai/docs — the headers are optional but power the public
// rankings; keyed off env so self-hosters can set their own app identity).
//
// A custom `baseUrl` passed from the engine (the ai_models row's base_url)
// overrides the default — useful for self-hosted OpenRouter-compatible gateways.

const { runWithTools: runOpenAiCompatible } = require('./openai');

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

async function runWithTools(opts) {
  return runOpenAiCompatible({
    ...opts,
    baseUrl: opts.baseUrl || DEFAULT_BASE_URL,
    headers: {
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://forgecrm.app',
      'X-OpenRouter-Title': process.env.OPENROUTER_SITE_NAME || 'ForgeChat',
    },
  });
}

module.exports = { runWithTools };