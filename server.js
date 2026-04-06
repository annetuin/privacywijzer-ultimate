const fs = require("fs");
let data = JSON.parse(fs.readFileSync("./data.json"));
app.get("/api/search", (req, res) => {
  const q = req.query.q.toLowerCase();
  res.json(data.questions.filter(item => item.question.includes(q)));
});
