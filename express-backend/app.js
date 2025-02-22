const express = require("express");
const cors = require("cors");
const test = require("./routes/data.js");

const app = express();
const port = 3010;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.json());
app.use(cors());
app.use("/api/test", test);
