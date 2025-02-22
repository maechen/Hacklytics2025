const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", (req, res) => {
    const process = spawn("python", [
        "process_vid.py",
        req.body.videoPath,
        "soccer_analytics.json",
    ]);

    let result = "";
    process.stdout.on("data", (data) => (result += data.toString()));

    process.on("close", (code) => {
        if (code !== 0) return res.status(500).json({ error: result });

        const cleaned = spawn("python", ["dataclean.py"]);
        cleaned.on("close", () => {
            const llm = spawn("python", ["chat_prompt.py"]);
            llm.on("close", () => {
                const output = require("child_process")
                    .execSync("python promptclean.py llm_output.txt")
                    .toString();
                res.json({ insight: output });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
