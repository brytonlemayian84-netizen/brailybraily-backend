const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KEY = process.env.GEMINI_API_KEY;
const ai = KEY ? new GoogleGenAI({ apiKey: KEY }) : null;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Braily AI Backend"
    });
});

app.post("/ask", async (req, res) => {
    try {
        if (!ai)
            return res.status(500).json({
                error: "Gemini API key is not configured."
            });

        const question = String(req.body.question || "").trim();

        if (!question)
            return res.status(400).json({
                error: "Question is required."
            });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
                systemInstruction:
                    "You are Braily, a helpful general-purpose AI assistant. " +
                    "Answer the user's actual question directly and naturally. " +
                    "You can help with education, school subjects, work, science, " +
                    "technology, mathematics, programming, writing, everyday life, " +
                    "planning, explanations, and general knowledge. " +
                    "Adapt your explanation to the user's question and provide " +
                    "clear, useful answers. Do not assume the question is about physics."
            }
        });

        const answer = result.text;

        if (!answer || !answer.trim())
            return res.status(502).json({
                error: "Gemini returned no answer."
            });

        res.json({
            answer: answer.trim()
        });

    } catch (error) {
        console.error("Braily Gemini error:", error);

        res.status(500).json({
            error: "Braily could not generate an answer."
        });
    }
});

app.listen(PORT, () => {
    console.log("Braily backend running on port " + PORT);
});