import { anthropic, CLAUDE_MODEL } from '../config/anthropic';

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

const STRATEGY_SYSTEM_PROMPT = `You are an IELTS Writing Task 1 examiner and coach. Given an image of a
Task 1 chart, graph, map, or process diagram, respond with ONLY a JSON object (no prose, no
markdown fences) of the form:
{
  "hints": ["short strategic tip", "..."],
  "sampleAnswer": "a full band 8.0+ sample answer, 150-200 words"
}`;

const EVALUATION_SYSTEM_PROMPT = `You are an official IELTS Writing Task 1 examiner. Score the
essay against the four official criteria (Task Achievement, Coherence & Cohesion, Lexical
Resource, Grammatical Range & Accuracy), each on the 0-9 band scale, plus an overall band score.
Respond with ONLY a JSON object (no prose, no markdown fences) of the form:
{
  "overallBand": 6.5,
  "criteria": {
    "taskAchievement": 6,
    "coherenceCohesion": 7,
    "lexicalResource": 6,
    "grammaticalRange": 7
  },
  "feedback": {
    "taskAchievement": "detailed comment",
    "coherenceCohesion": "detailed comment",
    "lexicalResource": "detailed comment",
    "grammaticalRange": "detailed comment",
    "summary": "overall constructive feedback"
  }
}`;

export async function generateStrategyFromImage(imageFile) {
  const base64Data = await fileToBase64(imageFile);
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1500,
    system: STRATEGY_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: imageFile.type, data: base64Data },
          },
          {
            type: 'text',
            text: 'Analyze this IELTS Writing Task 1 image and provide strategy hints and a sample answer.',
          },
        ],
      },
    ],
  });

  return extractJson(message.content[0].text);
}

export async function evaluateEssay(essayText, imageDescriptionOrHints) {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1500,
    system: EVALUATION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Task context/hints:\n${JSON.stringify(imageDescriptionOrHints)}\n\nStudent essay:\n${essayText}`,
      },
    ],
  });

  return extractJson(message.content[0].text);
}
