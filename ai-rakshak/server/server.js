import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Rakshak server is running 🇮🇳🛡️",
  });
});

// AI Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are AI Rakshak, an emergency and safety assistant for India.

Give clear, calm and practical safety guidance.

Help with:
- Emergency situations
- Disaster preparedness
- Road safety
- Public safety
- First-aid information
- Family safety
- Guidance for soldiers, veterans and their families

Do not pretend to contact emergency services.

User message:
${message}
`,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("❌ AI Error:", error);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🇮🇳 AI Rakshak server running at http://localhost:${PORT}`
  );
});