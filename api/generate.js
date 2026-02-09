// Vercel Serverless Function — proxies OpenAI requests using the site owner's API key.
// The key is stored as a Vercel environment variable (OPENAI_API_KEY) and never sent to the browser.

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  try {
    const { messages, max_tokens, temperature, mode } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errMsg = `OpenAI error (${response.status})`;
      try {
        const j = JSON.parse(errBody);
        if (j.error?.message) errMsg = j.error.message;
      } catch (_) {}
      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return res.status(200).json({ text });
  } catch (err) {
    console.error("generate error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
