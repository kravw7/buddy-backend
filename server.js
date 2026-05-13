import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

const WINDSURF_TOKEN = process.env.WINDSURF_TOKEN;

const CODEIUM_API_URL =
  process.env.CODEIUM_API_URL ||
  "https://api.codeium.com/chat/completions";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "buddy-backend",
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
  });
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    console.log("=== NEW REQUEST ===");

    if (!WINDSURF_TOKEN) {
      console.log("NO TOKEN");

      return res.status(500).json({
        error: "missing_token",
      });
    }

    console.log("TOKEN EXISTS");

    console.log("MODEL:", req.body.model);

    const response = await fetch(CODEIUM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WINDSURF_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });

    console.log("UPSTREAM STATUS:", response.status);

    const rawText = await response.text();

    console.log("UPSTREAM RESPONSE:");
    console.log(rawText);

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        raw: rawText,
      };
    }

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("SERVER ERROR:");
    console.error(err);

    return res.status(500).json({
      error: "proxy_error",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Buddy backend running on port", PORT);
});
