const express = require("express");
const router = express.Router();
const MenuItem = require("../modules/MenuItem");
const https = require("https");

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const options = {
      hostname,
      path,
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error("TIMEOUT"));
    });

    req.write(bodyStr);
    req.end();
  });
}

async function callGroq(systemPrompt, userMessage) {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("GROQ_API_KEY is missing from .env file");
  }

  const models = [
    "llama-3.3-70b-versatile",   
    "llama-3.1-8b-instant",     
    "llama3-70b-8192",           
  ];

  let lastError;

  for (const model of models) {
    console.log(`[AI] Trying model: ${model}`);

    try {
      const result = await httpsPost(
        "api.groq.com",
        "/openai/v1/chat/completions",
        { Authorization: `Bearer ${key}` },
        {
          model,
          max_tokens: 400,
          temperature: 0.7,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }
      );

      if (result.status === 200) {
        const text = result.body?.choices?.[0]?.message?.content;
        if (text) {
          return text;
        }
        throw new Error("Empty response body from Groq");
      }

      const groqError = result.body?.error?.message || JSON.stringify(result.body);
      console.warn(`[AI] Groq error on ${model} (${result.status}): ${groqError}`);

      lastError = new Error(groqError);
      lastError.status = result.status;

      if (result.status === 401) throw lastError;

      if (result.status === 429 || result.status === 503) continue;

      continue;

    } catch (err) {
      if (err.message === "TIMEOUT") {
        console.warn(`[AI] Timeout on ${model}. Trying next…`);
        lastError = err;
        continue;
      }
      if (err.status === 401) throw err;
      lastError = err;
      console.warn(`[AI] Error on ${model}: ${err.message}`);
    }
  }

  throw lastError || new Error("All Groq models failed");
}

router.post("/recommend", async (req, res) => {
  try {
    const { query } = req.body;
    console.log("[AI] Incoming query:", query);

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Please enter a question." });
    }

    const menuItems = await MenuItem.find().lean();

    const menuText =
      menuItems.length > 0
        ? menuItems
            .map((item) => `• ${item.name} — Rs.${item.price} (${item.category})`)
            .join("\n")
        : "The menu is currently empty.";

    const systemPrompt = `You are Aria, a helpful AI dining assistant for a hotel restaurant.

Help guests with food recommendations, dish descriptions, and budget suggestions.

LIVE MENU:
${menuText}

RULES:
- Only recommend dishes from the LIVE MENU above.
- If something is not on the menu, apologize and suggest the closest available item.
- Keep responses friendly and short (2-3 sentences).
- Use Rs. for prices.`;

    const answer = await callGroq(systemPrompt, query.trim());
    return res.json({ answer });

  } catch (err) {
    console.error("[AI ERROR] Status:", err.status, "| Message:", err.message);

    if (err.message.includes("GROQ_API_KEY is missing")) {
      return res.status(500).json({
        message: "Server config error: GROQ_API_KEY not set. Check your .env file.",
      });
    }
    if (err.status === 401) {
      return res.status(500).json({
        message: "Invalid Groq API key. Go to console.groq.com and create a new key.",
      });
    }
    if (err.status === 429) {
      return res.status(429).json({ message: "AI is rate-limited. Please wait a minute." });
    }
    if (err.message === "TIMEOUT") {
      return res.status(504).json({ message: "AI took too long. Please try again." });
    }

    return res.status(500).json({
      message: "Something went wrong.",
      detail: err.message,
    });
  }
});

module.exports = router;