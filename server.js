const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.static("public"));

let data = {questions: []};

try {
  data = JSON.parse(fs.readFileSync("./data.json"));
  console.log(`✅ Loaded ${data.questions.length} questions`);
} catch(e) {
  console.error("JSON load error:", e.message);
  data = {questions: [{question: "Demo vraag", answer: "Demo", category: "Test"}]};
}

app.get("/api/stats", (req, res) => {
  res.json({total: data.questions.length, status: "Privacywijzer LIVE"});
});

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = data.questions
    .filter(item => item.question.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    .slice(0, 50);
  res.json(results);
});

app.get("/api/categories", (req, res) => {
  const cats = [...new Set(data.questions.map(q => q.category))];
  res.json(cats);
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Privacywijzer on port ${port}`);
});
