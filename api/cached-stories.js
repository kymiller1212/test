// Vercel Serverless Function — checks for cached stories by topic in Supabase.
// Returns existing stories so we don't regenerate topics that already exist.
// Requires the "Anyone can read stories" RLS policy on generated_stories.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://grptfqinfouolxrrvnaz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycHRmcWluZm91b2x4cnJ2bmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTI0ODYsImV4cCI6MjA4NjE2ODQ4Nn0.NUAp55a0GJDuq8L01lTYWVVGYJwvvZg3L6nzYVH5HFA";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const topic = req.query.topic;
  if (!topic) return res.status(400).json({ error: "topic query param required" });

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Look for stories matching this topic from any user, get up to 6 (3 per level)
    const { data, error } = await sb
      .from("generated_stories")
      .select("story_key, topic, level, title, icon, content, words, quiz")
      .eq("topic", topic)
      .limit(6);

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(200).json({ stories: [] });
    }

    return res.status(200).json({ stories: data || [] });
  } catch (err) {
    console.error("Cache lookup error:", err);
    return res.status(200).json({ stories: [] });
  }
}
