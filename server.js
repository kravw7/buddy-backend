import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;
const WINDSURF_TOKEN = process.env.WINDSURF_TOKEN;
const CODEIUM_API_URL =
  process.env.CODEIUM_API_URL || "https://api.codeium.com/chat/completions";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ ok: true, service: "buddy-backend" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/v1/chat/completions", async (req, res) => {
  if (!WINDSURF_TOKEN) {
    return res.status(500).json({
      error: "missing_token",
      details: "WINDSURF_TOKEN is not configured on the server.",
    });
  }

  try {
    const response = await fetch(CODEIUM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WINDSURF_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json().catch(() => ({
      error: "invalid_upstream_json",
    }));

    return res.status(response.status).json(data);
  } catch (err) {
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
