const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
}

const ai = API_KEY
    ? new GoogleGenAI({ apiKey: API_KEY })
    : null;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Braily AI Backend"
    });
});

app.post("/ask", async (req, res) => {

    try {

        if (!ai) {
            return res.status(500).json({
                error: "Gemini API key is not configured."
            });
        }

        const question = req.body.question;

        if (!question ||
            typeof question !== "string") {

            return res.status(400).json({
                error: "Question is required."
            });
        }

        const response =
            await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents:
                    "You are Braily, a helpful AI assistant. " +
                    "Answer clearly and naturally. " +
                    "The user asked: " +
                    question
            });

        const answer =
            response.text || "";

        if (!answer) {
            return res.status(500).json({
                error: "Gemini returned an empty response."
            });
        }

        res.json({
            answer: answer
        });

    } catch (error) {

        console.error(
            "Gemini error:",
            error
        );

        res.status(500).json({
            error: "Gemini request failed."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        "Braily backend running on port " + PORT
    );
});