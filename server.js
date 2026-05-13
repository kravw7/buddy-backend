import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

const GROQ_API_KEY =
  process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "buddy-backend",
  });
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: req.body.messages,
        }),
      }
    );

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Buddy backend running on port", PORT);
});
