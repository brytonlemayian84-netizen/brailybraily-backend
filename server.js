const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Braily AI Backend"
    });
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        res.json({
            answer:
                "Braily backend received: " +
                question
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Backend error"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        "Braily server running on port " + PORT
    );
});