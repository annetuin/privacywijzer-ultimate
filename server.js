const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors({origin: true}));
app.use(express.static("public"));
app.use(express.json());

const db = new sqlite3.Database("./privacy.db", (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("✅ Database connected");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/stats", (req, res) => {
  db.get("SELECT COUNT(*) as total FROM questions", (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({total: row.total, status: "ULTIMATE Privacywijzer"});
  });
});

app.get("/api/search", (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.all("SELECT * FROM questions WHERE question LIKE ? OR category LIKE ? OR answer LIKE ? LIMIT 50", [q, q, q], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 ULTIMATE Privacywijzer listening on port ${port}`);
  console.log(`📱 Health: http://localhost:${port}/api/stats`);
});
