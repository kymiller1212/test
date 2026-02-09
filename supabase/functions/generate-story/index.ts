// Supabase Edge Function: generate-story
// Securely generates stories using the user's encrypted API key
// Deploy: supabase functions deploy generate-story

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Prompts (identical to client-side) ──────────────────────

function topicNamesPrompt(interests: string) {
  const system = `You generate reading topic names for a children's reading app. Given a parent's description of their child's interests, create exactly 6 unique topic names.

Each topic should:
- Be specific and exciting to a child (not generic)
- Be 2-4 words long
- Have a fun, relevant emoji icon

Respond with ONLY this JSON:
{
  "topics": [
    {"name": "Topic Name", "icon": "emoji"},
    {"name": "Topic Name", "icon": "emoji"},
    {"name": "Topic Name", "icon": "emoji"},
    {"name": "Topic Name", "icon": "emoji"},
    {"name": "Topic Name", "icon": "emoji"},
    {"name": "Topic Name", "icon": "emoji"}
  ]
}`;
  const user = `My child's interests: ${interests}\n\nGenerate 6 fun, specific reading topics based on these interests.`;
  return { system, user, maxTokens: 500, temperature: 0.8 };
}

function singleStoryPrompt(
  topicLabel: string,
  level: number,
  subtopic?: string,
  existingTitles?: string
) {
  let levelRules: string;
  if (level === 1) {
    levelRules = `LEVEL 1 — 2nd Grade Reading Level
- Target: approximately 90-100 words
- Use 4 paragraphs with 3 sentences each (about 12 sentences total)
- Average sentence length: 7-8 words. Keep ALL sentences under 12 words
- Use simple, common words a 2nd grader knows
- Short, punchy sentences with subject-verb-object structure`;
  } else {
    levelRules = `LEVEL 2 — 3rd Grade Reading Level
- Target: approximately 130-150 words
- Use 5 paragraphs with 2-3 sentences each (about 11-13 sentences total)
- Average sentence length: 11-13 words. Some sentences can reach 18 words
- Use grade-appropriate vocabulary with 3-4 challenging words
- Use compound sentences and descriptive language`;
  }

  const focusInstruction = subtopic
    ? `The story should specifically focus on: "${subtopic}" as it relates to ${topicLabel}.`
    : `Choose an interesting and unique angle about ${topicLabel} that is different from these existing stories: ${existingTitles || "none yet"}.`;

  const system = `You are a children's reading content creator specializing in dyslexia-friendly materials. Create ONE reading passage about the given topic.

${levelRules}

${focusInstruction}

Rules:
- Make it fun, engaging, and age-appropriate
- Be factually accurate when discussing real people, places, or things
- CRITICAL: Hit the target word count. Do NOT write a shorter story.

Respond with ONLY this JSON:
{
  "title": "Story Title",
  "content": ["paragraph1", "paragraph2", "paragraph3"${level === 2 ? ', "paragraph4", "paragraph5"' : ', "paragraph4"'}],
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
  "quiz": [
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 0},
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 1},
    {"q": "Question?", "choices": ["A", "B", "C"], "answer": 2}
  ]
}`;
  const user = `Write a ${level === 1 ? "2nd grade (90-100 words)" : "3rd grade (130-150 words)"} reading passage about ${topicLabel}${subtopic ? `, focusing on: ${subtopic}` : ""}.`;
  return { system, user, maxTokens: 2000, temperature: 0.7 };
}

function batchStoryPrompt(topicLabel: string, level: number) {
  let levelRules: string;
  let exampleStory: string;

  if (level === 1) {
    levelRules = `LEVEL 1 — 2nd Grade Reading Level
- Target: approximately 90-100 words per story
- Use 4 paragraphs with 3 sentences each (about 12 sentences total)
- Average sentence length: 7-8 words. Keep ALL sentences under 12 words
- Use simple, common words a 2nd grader knows (e.g. "big" not "enormous")
- Avoid multi-syllable words when a shorter word works
- Each paragraph should be about 20-25 words
- Short, punchy sentences with subject-verb-object structure
- Use periods, not semicolons or complex punctuation`;

    exampleStory = `Here is an example of the RIGHT length and style for Level 1:
{
  "title": "How Football Works",
  "content": [
    "Football is a fun and exciting sport. Two teams play against each other. Each team has 11 players on the field at a time.",
    "The goal is to get the ball into the end zone. You can run with the ball or throw it. When you score, it is called a touchdown!",
    "A touchdown is worth six points. Then you can kick for one more point. A field goal is worth three points.",
    "Each game has four quarters. The team with the most points at the end wins. Football is a great game to watch and play!"
  ],
  "words": ["teams", "players", "end zone", "touchdown", "points", "field goal", "quarters", "score"],
  "quiz": [
    {"q": "How many players are on the field per team?", "choices": ["9", "11", "15"], "answer": 1},
    {"q": "How many points is a touchdown?", "choices": ["Three", "Six", "Ten"], "answer": 1},
    {"q": "How many quarters are in a game?", "choices": ["Two", "Three", "Four"], "answer": 2}
  ]
}`;
  } else {
    levelRules = `LEVEL 2 — 3rd Grade Reading Level
- Target: approximately 130-150 words per story
- Use 5 paragraphs with 2-3 sentences each (about 11-13 sentences total)
- Average sentence length: 11-13 words. Some sentences can reach 18 words
- Use grade-appropriate vocabulary: include 3-4 challenging words per story
- Each paragraph should be about 25-30 words
- Use more complex sentence structures: compound sentences with "and", "but", "because", "while"
- Include more descriptive language and details than Level 1
- Vary sentence length for natural rhythm`;

    exampleStory = `Here is an example of the RIGHT length and style for Level 2:
{
  "title": "Rivalry with Michigan",
  "content": [
    "Every year, Ohio State plays a huge game against Michigan. This rivalry is one of the oldest in college football history. It has been going on since 1897!",
    "The week before the game, Ohio State fans refuse to say the letter M. They call Michigan \\"That Team Up North\\" instead. Players put a big X over every M on campus.",
    "The game is always played on the last Saturday of November. Both teams save their best effort for this special day. The stadium is always completely packed with screaming fans.",
    "Whoever wins the rivalry game gets bragging rights for the whole year. Some of the most exciting moments in college football have happened during this classic matchup.",
    "Ohio State students and alumni look forward to this game more than any other. Families pass down their love for the Buckeyes from generation to generation."
  ],
  "words": ["rivalry", "refuse", "campus", "bragging rights", "alumni", "generation", "matchup", "tradition"],
  "quiz": [
    {"q": "When did the Ohio State vs Michigan rivalry start?", "choices": ["1950", "1897", "2001"], "answer": 1},
    {"q": "What do Ohio State fans refuse to say?", "choices": ["The letter M", "The word football", "Michigan's score"], "answer": 0},
    {"q": "When is the game always played?", "choices": ["First week of October", "Last Saturday of November", "New Year's Day"], "answer": 1}
  ]
}`;
  }

  const system = `You are a children's reading content creator specializing in dyslexia-friendly materials. Create 3 different reading passages about the given topic.

${levelRules}

CRITICAL: Match the length and style of the example below. Each story MUST hit the target word count. Do NOT write shorter stories.

${exampleStory}

Additional rules:
- Each of the 3 stories must cover a DIFFERENT interesting aspect of the topic
- Make content fun, engaging, and age-appropriate
- Be factually accurate when discussing real people, places, or things
- Include 8 key vocabulary words from each passage in the "words" array
- Include 3 comprehension questions with 3 multiple-choice options each
- "answer" is the 0-based index of the correct choice

Respond with ONLY this JSON structure:
{
  "stories": [
    {
      "title": "...",
      "content": ["paragraph1", "paragraph2", "paragraph3", "paragraph4"],
      "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
      "quiz": [{"q": "...", "choices": ["A", "B", "C"], "answer": 0}, {"q": "...", "choices": ["A", "B", "C"], "answer": 1}, {"q": "...", "choices": ["A", "B", "C"], "answer": 2}]
    },
    { ... },
    { ... }
  ]
}`;
  const user = `Write 3 different ${level === 1 ? "2nd grade" : "3rd grade"} reading level passages about: ${topicLabel}. Remember: each story must be ${level === 1 ? "90-100" : "130-150"} words with ${level === 1 ? "4" : "5"} full paragraphs.`;
  return { system, user, maxTokens: 6000, temperature: 0.7 };
}

// ── AI API Calls ──────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number,
  temperature: number
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    let errMsg = `OpenAI API error (${response.status})`;
    try {
      const j = JSON.parse(errBody);
      if (j.error?.message) errMsg = j.error.message;
    } catch (_) { /* ignore parse error */ }
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number,
  temperature: number
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    let errMsg = `Anthropic API error (${response.status})`;
    try {
      const j = JSON.parse(errBody);
      if (j.error?.message) errMsg = j.error.message;
    } catch (_) { /* ignore parse error */ }
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callAI(
  apiKey: string,
  provider: string,
  system: string,
  user: string,
  maxTokens: number,
  temperature: number
) {
  if (provider === "anthropic") {
    return callAnthropic(apiKey, system, user, maxTokens, temperature);
  }
  return callOpenAI(apiKey, system, user, maxTokens, temperature);
}

// ── JSON Parsing ──────────────────────────────────────────

function parseJSON(text: string) {
  let jsonStr = text;
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1];
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) jsonStr = objMatch[0];
  return JSON.parse(jsonStr);
}

// ── Main Handler ──────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth: verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // Get user's API key (decrypted server-side)
    const { data: keyData, error: keyError } = await supabaseAdmin.rpc(
      "decrypt_api_key",
      { p_user_id: user.id }
    );

    if (keyError || !keyData) {
      return jsonResponse(
        { error: "No API key configured. Add one in Settings." },
        400
      );
    }

    const apiKey = keyData as string;

    // Get provider
    const { data: settings } = await supabaseAdmin
      .from("user_settings")
      .select("api_provider")
      .eq("id", user.id)
      .single();

    const provider = settings?.api_provider || "openai";

    // Parse request body
    const body = await req.json();
    const { mode, topic, level, subtopic, existingTitles, interests } = body;

    let prompt: { system: string; user: string; maxTokens: number; temperature: number };

    if (mode === "topics") {
      if (!interests) {
        return jsonResponse({ error: "Missing 'interests' field" }, 400);
      }
      prompt = topicNamesPrompt(interests);
    } else if (mode === "single") {
      if (!topic || !level) {
        return jsonResponse({ error: "Missing 'topic' or 'level'" }, 400);
      }
      prompt = singleStoryPrompt(topic, level, subtopic, existingTitles);
    } else if (mode === "batch") {
      if (!topic || !level) {
        return jsonResponse({ error: "Missing 'topic' or 'level'" }, 400);
      }
      prompt = batchStoryPrompt(topic, level);
    } else {
      return jsonResponse(
        { error: "Invalid mode. Use 'topics', 'single', or 'batch'" },
        400
      );
    }

    // Call AI
    const rawText = await callAI(
      apiKey,
      provider,
      prompt.system,
      prompt.user,
      prompt.maxTokens,
      prompt.temperature
    );

    // Parse and return
    const parsed = parseJSON(rawText);
    return jsonResponse(parsed);
  } catch (err) {
    console.error("Edge function error:", err);
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
