import Anthropic from '@anthropic-ai/sdk';

// NOTE: dangerouslyAllowBrowser exposes the API key to anyone who opens devtools.
// This is acceptable for local prototyping only — before shipping, move Claude calls
// behind a backend/Cloud Function so the key never reaches the client.
export const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const CLAUDE_MODEL = 'claude-3-5-sonnet-latest';
