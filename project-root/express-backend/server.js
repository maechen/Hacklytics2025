const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();
const axios = require("axios");
const OpenAIApi = require("openai");
const port = 4000;

const preloadedData = require("./data.js");

const key = require("./key.js");

const openai = new OpenAIApi({
  apiKey: key,
});
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

app.post("/api", async (req, res) => {
  data = JSON.parse(preloadedData);

  const events = [];
  let currPossesion;
  let startPos;

  let numFrames = Object.keys(data);

  if (req.body.timestamp !== undefined) {
    numFrames = numFrames.filter((frame) => {
      return parseInt(frame) < req.body.timestamp * 30;
    });
  }
  console.log(numFrames);
  for (const frame of numFrames) {
    //console.log(frame);
    const players = data[frame].players;

    for (const player in players) {
      if (players[player]["has_ball"]) {
        if (currPossesion && player !== currPossesion.player) {
          //console.log(player, currPossesion);
          let event = {
            player,
            team: players[player].team,
            deltaX:
              players[player].coordinates[0] - currPossesion.coordinates[0],
            deltaY:
              players[player].coordinates[1] - currPossesion.coordinates[1],
            time: (frame - currPossesion.frame) / 30,
          };

          currPossesion = { ...players[player], player, frame };

          events.push(event);

          startPos = players[player].coordinates;
        } else {
          currPossesion = { ...players[player], player, frame };
          startPos = player.coordinates;
        }
      }
    }
  }

  try {
    const prompt = `
    Here is an array of objects representing players in a soccer game who have possesion of the ball 
    with time measured by seconds for how long they had possesion.
    Summarize in 3-4 sentences what's happening in the game chronologically. 
    Do not explicity talk about how long a player had possession. 
    Team 1 is trying to take the ball to a positive deltaX and 
    team 2 is trying to take the ball to a negative deltaX.

    JSON data:
    ${JSON.stringify(events)}
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a soccer expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    res.json({ analysis: " " + response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
