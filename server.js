const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Braily Universal AI"
    });
});

app.post("/ask", async (req, res) => {
    try {
        if (!KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is missing on Render."
            });
        }

        const question = String(
            req.body.question || ""
        ).trim();

        if (!question) {
            return res.status(400).json({
                error: "Question is empty."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: KEY
        });

        const response =
            await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: question
            });

        const answer = response.text;

        if (!answer || !answer.trim()) {
            return res.status(502).json({
                error: "Gemini returned an empty answer."
            });
        }

        res.json({
            answer: answer.trim()
        });

    } catch (error) {
        console.error("GEMINI_ERROR:", error);

        res.status(500).json({
            error: "Gemini request failed.",
            details: String(error.message || error)
        });
    }
});

app.listen(PORT, () => {
    console.log(
        "Braily backend running on port " + PORT
    );
});